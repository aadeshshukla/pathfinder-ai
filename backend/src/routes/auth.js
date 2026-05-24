import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import User from '../models/Users.js';
import config from '../config.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset attempts. Please try again later.' }
});
const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const isValidEmail = (value) => {
  if (!value || value.length > 254 || value.includes(' ')) return false;
  const atIndex = value.indexOf('@');
  if (atIndex <= 0 || atIndex !== value.lastIndexOf('@') || atIndex === value.length - 1) return false;
  const domain = value.slice(atIndex + 1);
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
};

const buildResetLink = (token) => `${config.frontendURL}/reset-password?token=${token}`;

const createMailTransport = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpService = process.env.SMTP_SERVICE;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost && !smtpService) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    service: smtpService || undefined,
    port: smtpPort ? Number(smtpPort) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined
  });
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const transporter = createMailTransport();

  if (!transporter) {
    console.warn('Password reset email provider is not configured. Falling back to an in-app reset link.');
    return false;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.MAIL_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@pathfinder-ai.local';

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Reset your Pathfinder AI password',
      text: `Reset your password using this link: ${resetLink}\n\nThis link expires in 1 hour and can only be used once.`,
      html: `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour and can only be used once.</p>`
    });

    return true;
  } catch (error) {
    console.error('Password reset email delivery failed:', error);
    return false;
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User. findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, config. jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req. body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User. findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, config. jwtSecret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
  try {
    const message = 'If that email is registered, a password reset link has been sent.';
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.json({ message });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ message });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
    await user.save();

    const resetLink = buildResetLink(rawToken);
    const emailDelivered = await sendPasswordResetEmail(user.email, resetLink);

    return res.json({
      message,
      ...(emailDelivered ? {} : { resetLink, fallback: true })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

router.post('/reset-password', passwordResetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return res.status(400).json({ error: 'Reset token is invalid or has expired' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset token is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req. user.username,
        email: req.user.email,
        createdAt: req. user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

export default router;
