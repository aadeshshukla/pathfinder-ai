// src/components/StepThree.jsx
import React from 'react';
import './StepBase.css';

export default function StepThree({ onNext }) {
  return (
    <div className="step-container">
      <h2>Step 3 — Mapping your journey...</h2>
      <p className="small-muted">Analyzing inputs and sequencing resources — this may be fast.</p>
      <div style={{ marginTop: 14 }}>
        <button onClick={onNext}>Show Roadmap →</button>
      </div>
    </div>
  );
}



