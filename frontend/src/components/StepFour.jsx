import React from 'react';
import './StepFour.css';

const StepFour = ({ roadmapData, isLoading, error, onPrevious }) => {
  if (isLoading) {
    return (
      <div className="step-container compact">
        <div className="loading-state">
          <div className="spinner"></div>
          <h2>🎨 Generating Your Roadmap...</h2>
          <p>Our AI is crafting your personalized learning path. This may take a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step-container compact">
        <div className="error-state">
          <h2>😕 Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button onClick={onPrevious} className="btn btn-primary">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="step-container compact">
        <div className="empty-state">
          <h2>📭 No roadmap to display</h2>
          <p>Something unexpected happened. Let's start over.</p>
          <button onClick={onPrevious} className="btn btn-primary">
            🏠 Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-view">
      <div className="roadmap-header">
        <h1>🎯 Your Learning Roadmap is Ready!</h1>
        <div className="roadmap-meta">
          <span className="duration-badge">
            ⏱️ {roadmapData.timeline.totalDays} days total
          </span>
          <span className="milestone-count">
            🎯 {roadmapData.milestones.length} milestones
          </span>
        </div>
      </div>

      <div className="roadmap-content">
        {roadmapData.milestones.map((milestone, index) => (
          <div key={milestone.id || index} className="milestone-card">
            <div className="milestone-header">
              <span className="milestone-number">{index + 1}</span>
              <div className="milestone-info">
                <h3>{milestone.title}</h3>
                <div className="milestone-duration">
                  📅 {milestone.estimatedDays} days
                </div>
              </div>
            </div>
            
            <p className="milestone-description">{milestone.description}</p>
            
            {milestone.tasks && milestone.tasks.length > 0 && (
              <div className="milestone-tasks">
                <h4>📋 Key Tasks</h4>
                <ul className="task-list">
                  {milestone.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="task-item">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {roadmapData.resources && roadmapData.resources.length > 0 && (
          <div className="resources-section">
            <h2>📚 Recommended Resources</h2>
            <div className="resources-grid">
              {roadmapData.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <span className={`resource-badge ${resource.type.toLowerCase()}`}>
                    {resource.type}
                  </span>
                  <span className="resource-name">{resource.name}</span>
                  <span className="external-link">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="roadmap-actions">
        <button onClick={onPrevious} className="btn btn-primary">
          🆕 Create New Roadmap
        </button>
      </div>
    </div>
  );
};

export default StepFour;






