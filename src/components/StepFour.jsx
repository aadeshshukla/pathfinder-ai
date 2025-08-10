import React from 'react';
import './StepBase.css';

export default function StepFour({ nodes, edges, onNext }) {
  // Create a quick map for node lookup
  const nodeMap = nodes.reduce((map, node) => {
    map[node.id] = node;
    return map;
  }, {});

  return (
    <div className="step-container">
      <h2 className="step-title">Your Learning Roadmap</h2>
      
      {edges.length === 0 ? (
        <p>No roadmap data available. Please add edges in Step 6 (Admin).</p>
      ) : (
        <ul className="roadmap-list">
          {edges.map((edge) => (
            <li key={edge.id} className="roadmap-item">
              <strong>{nodeMap[edge.from_node_id]?.title || 'Unknown'}</strong> 
              <span style={{ margin: '0 8px' }}>→</span> 
              {nodeMap[edge.to_node_id]?.title || 'Unknown'}
            </li>
          ))}
        </ul>
      )}

      <button className="next-btn" onClick={onNext}>
        Next
      </button>
    </div>
  );
}



