import React from 'react';
import './StepFour.css';

export default function StepFour({ goal, sortedNodes, onAddNew }) {
  return (
    <div className="step-four">
      <h2>Step 4: Your Personalized Path 📍</h2>
      {sortedNodes.length === 0 ? (
        <p>No resources found or missing prerequisites.</p>
      ) : (
        sortedNodes.map((step, i) => (
          <div className="step-card" key={i}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <a href={step.link} target="_blank" rel="noreferrer">Visit Resource ↗</a>
            <p>⏱ {step.estimated_time}</p>
          </div>
        ))
      )}
      <button onClick={onAddNew}>➕ Add a new resource</button>
    </div>
  );
}

