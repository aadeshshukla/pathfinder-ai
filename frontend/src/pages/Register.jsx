import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import logo from '../assets/pathfinder-logo.png';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordValidation = {
    minLength: password.length >= 6,
    match: password === confirmPassword && password.length > 0,
  };

  const isFormValid = username. length >= 3 && 
                       email.length > 0 && 
                       passwordValidation.minLength && 
                       passwordValidation.match;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Form */}
      <motion.div 
        className="auth-form-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-form-container">
          <Link to="/" className="auth-logo-link">
            <img src={logo} alt="Pathfinder AI" className="auth-logo" />
          </Link>
          
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Start your personalized learning journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">
                <FiUser /> Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                minLength="3"
                autoFocus
              />
              {username.length > 0 && username.length < 3 && (
                <span className="input-error">Username must be at least 3 characters</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock /> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target. value)}
                placeholder="••••••••"
                required
                minLength="6"
              />
              {password.length > 0 && (
                <div className="password-strength">
                  <div className={`strength-indicator ${passwordValidation.minLength ?  'valid' : 'invalid'}`}>
                    {passwordValidation. minLength ?  <FiCheck /> : <FiX />}
                    <span>At least 6 characters</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FiLock /> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              {confirmPassword.length > 0 && (
                <div className="password-strength">
                  <div className={`strength-indicator ${passwordValidation.match ? 'valid' :  'invalid'}`}>
                    {passwordValidation.match ?  <FiCheck /> : <FiX />}
                    <span>Passwords match</span>
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={loading}
              disabled={!isFormValid}
              icon={<FiArrowRight />}
            >
              Sign Up
            </Button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Hero */}
      <motion.div 
        className="auth-hero-section"
        initial={{ opacity:  0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="auth-hero-content">
          <h2>Begin Your Journey</h2>
          <p>Join thousands of learners creating personalized roadmaps to achieve their goals.</p>
          
          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <div>
                <h4>Quick Setup</h4>
                <p>Get started in less than 2 minutes</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎓</span>
              <div>
                <h4>Smart Learning Paths</h4>
                <p>AI-powered roadmaps tailored to you</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h4>Track Your Progress</h4>
                <p>Monitor your learning journey</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Background */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;