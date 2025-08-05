import React from 'react';
import './StepTwo.css';

export default function StepTwo({ context, setContext, onNext }) {
  return (
    <div className="step-two">
      <h2>Step 2: Tell us about yourself 🧠</h2>
      <input
        placeholder="Your skill level"
        value={context.level}
        onChange={(e) => setContext({ ...context, level: e.target.value })}
      />
      <input
        placeholder="Time per week"
        value={context.time}
        onChange={(e) => setContext({ ...context, time: e.target.value })}
      />
      <input
        placeholder="Preferred content (e.g. videos, books)"
        value={context.preference}
        onChange={(e) => setContext({ ...context, preference: e.target.value })}
      />
      <button onClick={onNext}>Generate Path →</button>
    </div>
  );
}

