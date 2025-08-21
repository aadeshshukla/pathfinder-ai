import React, { useState } from 'react';
import './StepBase.css';

const StepThree = ({ formData, onNext, onPrevious, onRoadmapGeneration }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: formData.goal,
          experience: formData.experience,
          timeCommitment: formData.timeCommitment,
          learningStyle: formData.learningStyle,
          access: formData.access,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the roadmap generation.');
      }

      const data = await response.json();
      onRoadmapGeneration(data); // Pass the generated data to the parent
      onNext(); // Move to the next step
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="step">
      <h2>Ready to Generate Your Personalized Roadmap?</h2>
      <p>Click the button below to let our AI create a custom learning path based on your inputs.</p>
      
      <div className="navigation-buttons">
        <button onClick={onPrevious} disabled={isLoading}>Previous</button>
        <button onClick={handleGenerateRoadmap} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default StepThree;



