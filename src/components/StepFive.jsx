import React, { useState } from 'react';
import './StepBase.css';

export default function StepFive({ addNode, onNext }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="step-container">
      <h2>Add a New Resource</h2>
      <input
        type="text"
        placeholder="Resource title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button onClick={() => { addNode(title, description); onNext(); }}>
        Save & Next →
      </button>
    </div>
  );
}

