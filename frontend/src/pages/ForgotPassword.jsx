import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import logo from '../assets/pathfinder-logo.png';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [resetLinkNotice, setResetLinkNotice] = useState('');
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await requestPasswordReset(email);
      if (data.resetLink) {
        setResetLink(data.resetLink);
        setResetLinkNotice(
          data.fallback
            ? 'Email delivery is not configured on this server, so use the reset link below.'
            : 'If email delivery is configured, check your inbox for the reset link.'
        );
      }
      toast.success(data.message || 'If that email exists, a reset link has been sent.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-section">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo-link">
            <img src={logo} alt="Pathfinder AI" className="auth-logo" />
          </Link>
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email"><FiMail /> Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <Button type="submit" fullWidth size="lg" loading={loading} icon={<FiArrowRight />}>
              Send Reset Link
            </Button>
          </form>

          {resetLink && (
            <div style={{ marginTop: '0.75rem' }}>
              {resetLinkNotice && <p>{resetLinkNotice}</p>}
              <p style={{ wordBreak: 'break-all' }}>
                Reset link: <a href={resetLink}>{resetLink}</a>
              </p>
            </div>
          )}

          <div className="auth-footer">
            <p>Remembered your password? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
      <div className="auth-hero-section">
        <div className="auth-hero-content">
          <h2>Account Recovery</h2>
          <p>Reset links are single-use and expire shortly for your security.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
