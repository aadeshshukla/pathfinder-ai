import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiPlusCircle, FiList, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/pathfinder-logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/create', icon: <FiPlusCircle />, label: 'Create Roadmap' },
    { to: '/my-roadmaps', icon: <FiList />, label: 'My Roadmaps' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-brand">
          <img src={logo} alt="Pathfinder AI" className="navbar-logo" />
          <div className="navbar-brand-text">
            <h1>Pathfinder AI</h1>
            <p>Learning Journey</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link. to}
              to={link. to}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' :  ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.username?. charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?. username}</span>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <FiUser /> Profile
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion. div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
            <button className="mobile-menu-link" onClick={handleLogout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;