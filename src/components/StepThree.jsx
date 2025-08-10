import React from 'react';
import './StepBase.css';

export default function StepThree({ onNext }) {
  return (
    <div className="step-container">
      <h2>Step 3: Generating Your Learning Plan...</h2>
      <p>Please wait while we prepare your personalized roadmap.</p>
      <button onClick={onNext}>View Roadmap →</button>
    </div>
  );
}


