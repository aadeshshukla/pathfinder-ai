// src/components/StepOne.jsx
import React from 'react';
import './StepBase.css';

export default function StepOne({ goal, setGoal, onNext }) {
  return (
    <div className="step-container">
      <h2>Step 1 — What's your learning goal?</h2>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g. Become a Full Stack Developer"
      />
      <button onClick={onNext}>Next →</button>
    </div>
  );
}



