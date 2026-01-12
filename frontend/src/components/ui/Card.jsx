import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ 
  children, 
  hover = false, 
  className = '',
  onClick,
  ...props 
}) => {
  const cardClass = `card ${hover ? 'card-hover' : ''} ${className}`;
  
  if (onClick || hover) {
    return (
      <motion.div
        className={cardClass}
        onClick={onClick}
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;