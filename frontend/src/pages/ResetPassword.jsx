import React, { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import logo from '../assets/pathfinder-logo.png';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      toast.success('Password reset successful. Please log in.');
      navigate('/login');
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
            <h1>Set New Password</h1>
            <p>Choose a new password for your account.</p>
          </div>

          {!token ? (
            <div className="auth-footer">
              <p>Invalid reset link. Please <Link to="/forgot-password">request a new one</Link>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password"><FiLock /> New Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword"><FiLock /> Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              <Button type="submit" fullWidth size="lg" loading={loading} icon={<FiArrowRight />}>
                Reset Password
              </Button>
            </form>
          )}

          <div className="auth-footer">
            <p>Back to <Link to="/login">login</Link></p>
          </div>
        </div>
      </div>
      <div className="auth-hero-section">
        <div className="auth-hero-content">
          <h2>Secure Reset</h2>
          <p>Reset tokens are time-limited and can only be used once.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
