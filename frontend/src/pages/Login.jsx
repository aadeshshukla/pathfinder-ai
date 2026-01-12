import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import logo from '../assets/pathfinder-logo.png';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!  🎉');
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
            <h1>Welcome Back</h1>
            <p>Log in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
                autoFocus
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={loading}
              icon={<FiArrowRight />}
            >
              Log In
            </Button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account?  <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Hero */}
      <motion.div 
        className="auth-hero-section"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x:  0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="auth-hero-content">
          <h2>Your Learning Journey Awaits</h2>
          <p>Access your personalized roadmaps and continue learning at your own pace. </p>
          
          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <h4>Personalized Roadmaps</h4>
                <p>AI-generated learning paths tailored to your goals</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💾</span>
              <div>
                <h4>Save & Track Progress</h4>
                <p>Keep all your learning roadmaps in one place</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Learn Your Way</h4>
                <p>Multiple learning styles and pace options</p>
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
      </motion. div>
    </div>
  );
};

export default Login;