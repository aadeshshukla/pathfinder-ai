import React, { useState } from 'react';
import './StepBase.css';

const StepThree = ({ formData, onNext, onPrevious, onRoadmapGeneration }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRoadmap = async () => {
    // Prevent multiple submissions while one is already in progress
    if (isLoading) return; 

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Something went wrong during roadmap generation.');
      }

      const data = await response.json();
      // Ensure you are passing the nested data object
      onRoadmapGeneration(data.data); 
      onNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="step-container">
      <h2>Ready to Generate Your Personalized Roadmap?</h2>
      <p>Click the button below to let our AI create a custom learning path based on your inputs.</p>
      
      <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '20px' }}>
        <button onClick={onPrevious} disabled={isLoading}>Previous</button>
        <button onClick={handleGenerateRoadmap} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </div>
      {error && <p className="error-message" style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
};

export default StepThree;



