// src/components/StepFive.jsx
import React, { useState } from 'react';
import './StepBase.css';

export default function StepFive({ addNode, onNext }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [type, setType] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { alert('Title required'); return; }
    const ok = await addNode({
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      focus_area: focusArea.trim(),
      estimated_time: estimatedTime.trim(),
      type: type.trim()
    });
    if (ok) {
      setTitle(''); setDescription(''); setLink(''); setFocusArea(''); setEstimatedTime(''); setType('');
      alert('Resource saved');
    }
  };

  return (
    <div className="step-container">
      <h2>Step 5 — Add a new resource (Admin)</h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
      <input placeholder="Focus area (e.g., React)" value={focusArea} onChange={(e) => setFocusArea(e.target.value)} />
      <input placeholder="Estimated time (e.g., 2 hours)" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
      <input placeholder="Type (video, book, doc)" value={type} onChange={(e) => setType(e.target.value)} />

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
        <button onClick={handleSave}>Save Resource</button>
        <button className="secondary" onClick={onNext}>Next → (Add relationships)</button>
      </div>
    </div>
  );
}


