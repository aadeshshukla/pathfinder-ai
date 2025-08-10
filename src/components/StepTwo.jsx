// src/components/StepTwo.jsx
import React from 'react';
import './StepBase.css';

export default function StepTwo({ context, setContext, onNext }) {
  // context: { level, time, preference }
  return (
    <div className="step-container">
      <h2>Step 2 — Tell us about yourself</h2>

      <select value={context.level} onChange={(e) => setContext({ ...context, level: e.target.value })}>
        <option value="">Select skill level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <input
        type="number"
        value={context.time}
        onChange={(e) => setContext({ ...context, time: e.target.value })}
        placeholder="Hours per week you can commit"
      />

      <input
        value={context.preference}
        onChange={(e) => setContext({ ...context, preference: e.target.value })}
        placeholder="Preferred content (video, text, project)"
      />

      <button onClick={onNext}>Generate Path →</button>
    </div>
  );
}



