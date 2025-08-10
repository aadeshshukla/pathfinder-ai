// src/components/StepFour.jsx
import React from 'react';
import './StepBase.css';

export default function StepFour({ sortedNodes = [], edges = [], onNext }) {
  return (
    <div className="step-container">
      <h2>Step 4 — Your Learning Roadmap</h2>

      {sortedNodes.length === 0 ? (
        <p className="small-muted">No ordered roadmap available yet. Add resources and relationships (admin) to build one.</p>
      ) : (
        <>
          <div style={{ marginTop: 8, marginBottom: 12, textAlign: 'left' }}>
            <p className="small-muted">Ordered sequence of learning resources (topological order):</p>
          </div>

          {sortedNodes.map((n, idx) => (
            <div key={n.id} className="node-card">
              <h3>{idx + 1}. {n.title}</h3>
              {n.description && <p>{n.description}</p>}
              {n.link && <p style={{ marginTop: 8 }}><a href={n.link} target="_blank" rel="noreferrer">Open resource ↗</a></p>}
              {n.estimated_time && <p className="small-muted" style={{ marginTop: 8 }}>⏱ {n.estimated_time}</p>}
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}




