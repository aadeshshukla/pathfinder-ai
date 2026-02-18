import React from 'react';
import './Skeleton.css';

const Skeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-loader">
        <div className="skeleton-spinner"></div>
        <p className="skeleton-text">Loading...</p>
      </div>
    </div>
  );
};

export default Skeleton;
