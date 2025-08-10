
// src/components/StepSix.jsx
import React, { useState } from 'react';
import './StepBase.css';

export default function StepSix({ nodes = [], addEdge }) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [relationship, setRelationship] = useState('prerequisite');

  const handleAdd = async () => {
    if (!fromId || !toId) { alert('Select both nodes'); return; }
    if (fromId === toId) { alert('From and To must differ'); return; }
    const ok = await addEdge(fromId, toId, relationship);
    if (ok) { setFromId(''); setToId(''); setRelationship('prerequisite'); alert('Connection saved'); }
  };

  return (
    <div className="step-container">
      <h2>Step 6 — Connect resources (Admin)</h2>

      <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
        <option value="">From node</option>
        {nodes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
      </select>

      <select value={toId} onChange={(e) => setToId(e.target.value)}>
        <option value="">To node</option>
        {nodes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
      </select>

      <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
        <option value="prerequisite">prerequisite</option>
        <option value="related">related</option>
      </select>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleAdd}>Save Connection</button>
      </div>
    </div>
  );
}

