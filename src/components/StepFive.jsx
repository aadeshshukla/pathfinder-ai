import React from 'react';
import './StepFive.css';

export default function StepFive({ newNode, setNewNode, onAdd }) {
  return (
    <div className="step-five">
      <h2>Step 5: Add New Resource ➕</h2>
      <input
        placeholder="Title"
        value={newNode.title}
        onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={newNode.description}
        onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
      />
      <input
        placeholder="Link"
        value={newNode.link}
        onChange={(e) => setNewNode({ ...newNode, link: e.target.value })}
      />
      <input
        placeholder="Focus Area"
        value={newNode.focus_area}
        onChange={(e) => setNewNode({ ...newNode, focus_area: e.target.value })}
      />
      <input
        placeholder="Estimated Time"
        value={newNode.estimated_time}
        onChange={(e) => setNewNode({ ...newNode, estimated_time: e.target.value })}
      />
      <input
        placeholder="Type (e.g. video, doc)"
        value={newNode.type}
        onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
      />
      <button onClick={onAdd}>Add Resource</button>
    </div>
  );
}

