import React from 'react';
import './StepFour.css';

const StepFour = ({ roadmapData, onPrevious, isLoading, error }) => {
  // 1. Show a loading state
  if (isLoading) {
    return (
      <div className="step-container">
        <h2>Generating your roadmap...</h2>
        <p>Our AI is crafting your personalized path. Please wait a moment.</p>
      </div>
    );
  }

  // 2. Show an error state
  if (error) {
    return (
      <div className="step-container">
        <h2>Oops! Something went wrong.</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={onPrevious}>Try Again</button>
      </div>
    );
  }

  // 3. Show this if something unexpected happens
  if (!roadmapData) {
    return (
      <div className="step-container">
        <h2>No roadmap to display.</h2>
        <button onClick={onPrevious}>Start Over</button>
      </div>
    );
  }

  // 4. Show the successful roadmap
  return (
    <div className="step-container roadmap-container">
      <h2>Your Personalized Learning Roadmap is Ready!</h2>
      <p className="roadmap-intro">
        Here is your step-by-step guide. Total estimated time: <strong>{roadmapData.timeline.totalDays} days</strong>.
      </p>

      {roadmapData.milestones.map((milestone) => (
        <div key={milestone.id} className="module-card">
          <h3>{milestone.title}</h3>
          <p className="module-duration"><strong>Estimated Duration:</strong> {milestone.estimatedDays} days</p>
          <p className="module-description">{milestone.description}</p>
          <div className="topic-card">
            <h4>Key Tasks & Topics:</h4>
            <ul>
              {milestone.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <div className="navigation-buttons">
        <button onClick={onPrevious}>Create a New Roadmap</button>
      </div>
    </div>
  );
};

export default StepFour;






