// src/components/ProgressBar.jsx
import React from 'react';
import './StepBase.css';

export default function ProgressBar({ step = 1, totalSteps = 6 }) {
  const percentage = Math.round((step / totalSteps) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: '#334155', maxWidth: 760, margin: '0 auto 6px' }}>
        <div>Step {step} of {totalSteps}</div>
        <div>{percentage}%</div>
      </div>
      <div className="progress-wrapper" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="progress-bar" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}


