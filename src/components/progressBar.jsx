import React from 'react';
import './StepBase.css'; // uses the progress styles added there

export default function ProgressBar({ step, totalSteps }) {
  const percentage = Math.round((step / totalSteps) * 100);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: '#444' }}>
        <div>Step {step} of {totalSteps}</div>
        <div>{percentage}%</div>
      </div>
      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

