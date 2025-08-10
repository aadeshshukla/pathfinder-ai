import React from 'react';
import './StepBase.css';

export default function StepTwo({ skillLevel, setSkillLevel, timePerWeek, setTimePerWeek, onNext }) {
  return (
    <div className="step-container">
      <h2>Step 2: Your Current Skills & Availability</h2>
      <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
        <option value="">Select Skill Level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <input
        type="number"
        placeholder="Hours available per week"
        value={timePerWeek}
        onChange={(e) => setTimePerWeek(e.target.value)}
      />

      <button onClick={onNext}>Next →</button>
    </div>
  );
}


