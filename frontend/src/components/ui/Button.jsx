import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${fullWidth ?  'btn-full' : ''} ${className}`;
  
  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ?  (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;