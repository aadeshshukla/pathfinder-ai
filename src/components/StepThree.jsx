import React from 'react';
import './StepThree.css';

export default function StepThree({ onNext }) {
  return (
    <div className="step-three">
      <h2>Step 3: Mapping your journey... ⚙️</h2>
      <p>Analyzing your inputs and curating resources...</p>
      <button onClick={onNext}>Show Path →</button>
    </div>
  );
}

