import React from 'react';
import './StepBase.css';

export default function ProgressBar({ currentStep = 1, totalSteps = 4 }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-text">Step {currentStep} of {totalSteps}</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-wrapper">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>
    </div>
  );
}


