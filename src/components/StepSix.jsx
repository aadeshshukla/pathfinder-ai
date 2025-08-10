
import React, { useState } from 'react';
import './StepBase.css';

export default function StepSix({ nodes, addEdge }) {
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');

  return (
    <div className="step-container">
      <h2>Create a Connection Between Resources</h2>
      <select value={fromNode} onChange={(e) => setFromNode(e.target.value)}>
        <option value="">From Node</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>{node.title}</option>
        ))}
      </select>

      <select value={toNode} onChange={(e) => setToNode(e.target.value)}>
        <option value="">To Node</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>{node.title}</option>
        ))}
      </select>

      <button onClick={() => addEdge(fromNode, toNode)}>Save Connection</button>
    </div>
  );
}
