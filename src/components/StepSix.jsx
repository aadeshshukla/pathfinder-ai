import './StepSix.css'
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './StepSix.css';

export default function StepSix({ onBack }) {
  const [nodes, setNodes] = useState([]);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [relationship, setRelationship] = useState('prerequisite');

  useEffect(() => {
    const fetchNodes = async () => {
      const { data, error } = await supabase.from('nodes').select('*');
      if (error) {
        console.error('Error fetching nodes:', error);
      } else {
        setNodes(data);
      }
    };
    fetchNodes();
  }, []);

  const handleAddEdge = async () => {
    if (!fromId || !toId || fromId === toId) {
      alert('Please select different From and To nodes.');
      return;
    }

    const { error } = await supabase.from('edges').insert([
      {
        from_node_id: fromId,
        to_node_id: toId,
        relationship_type: relationship
      }
    ]);

    if (error) {
      alert('❌ Failed to add edge');
      console.error(error);
    } else {
      alert('✅ Edge added successfully!');
      setFromId('');
      setToId('');
      setRelationship('prerequisite');
    }
  };

  return (
    <div className="step-six-container">
      <h2>Add Edge Between Resources</h2>

      <label>From Node:</label>
      <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
        <option value="">-- Select --</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.title}
          </option>
        ))}
      </select>

      <label>To Node:</label>
      <select value={toId} onChange={(e) => setToId(e.target.value)}>
        <option value="">-- Select --</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.title}
          </option>
        ))}
      </select>

      <label>Relationship Type:</label>
      <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
        <option value="prerequisite">prerequisite</option>
        <option value="related">related</option>
      </select>

      <div className="btn-group">
        <button onClick={handleAddEdge}>Add Edge</button>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>
    </div>
  );
}