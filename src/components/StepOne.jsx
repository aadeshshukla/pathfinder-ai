import React from 'react';
import './StepBase.css';

export default function StepOne({ goal, setGoal, onNext }) {
  return (
    <div className="step-container">
      <h2>Step 1: Define Your Goal 🎯</h2>
      <input
        type="text"
        placeholder="e.g. Become a Full Stack Developer"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button onClick={onNext}>Next →</button>
    </div>
  );
}


