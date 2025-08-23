import React from 'react';
import './StepBase.css';

const StepThree = ({ onGenerate, onPrevious }) => {
  return (
    <div className="step-container">
      <h2>Ready to Generate Your Personalized Roadmap?</h2>
      <p>Click the button below to let our AI create a custom learning path based on your inputs.</p>
      
      <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onPrevious}>Previous</button>
        <button onClick={onGenerate}>Generate Roadmap</button>
      </div>
    </div>
  );
};

export default StepThree;


