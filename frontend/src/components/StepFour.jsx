import React from 'react';
import './StepFour.css';

const StepFour = ({ roadmapData, isLoading, error, onPrevious, viewMode = false }) => {
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

  // Debug:  Log the roadmap data structure
  console. log('📊 Roadmap Data Structure:', roadmapData);

  // Flexible data extraction - handle multiple possible structures
  const getMilestones = () => {
    // Try different possible property names
    if (roadmapData.milestones) return roadmapData.milestones;
    if (roadmapData.phases) return roadmapData.phases;
    if (roadmapData.steps) return roadmapData.steps;
    if (roadmapData.modules) return roadmapData.modules;
    if (Array.isArray(roadmapData)) return roadmapData;
    
    // If it's an object with nested data, try to extract array
    const values = Object.values(roadmapData);
    const firstArray = values. find(val => Array.isArray(val));
    if (firstArray) return firstArray;
    
    return [];
  };

  const getTimeline = () => {
    if (roadmapData.timeline?. totalDays) return roadmapData.timeline. totalDays;
    if (roadmapData.totalDays) return roadmapData.totalDays;
    if (roadmapData.duration) return roadmapData.duration;
    return null;
  };

  const getResources = () => {
    if (roadmapData.resources) return roadmapData.resources;
    if (roadmapData.recommendedResources) return roadmapData.recommendedResources;
    return [];
  };

  const milestones = getMilestones();
  const totalDays = getTimeline();
  const resources = getResources();

  // If no milestones found, show raw JSON for debugging
  if (milestones.length === 0) {
    return (
      <div className="roadmap-view">
        <div className="roadmap-header">
          <h1>🎯 Your Learning Roadmap</h1>
        </div>
        <div className="roadmap-content">
          <div className="debug-view">
            <h3>⚠️ Roadmap Structure Not Recognized</h3>
            <p>Here's the raw data received: </p>
            <pre className="debug-json">
              {JSON.stringify(roadmapData, null, 2)}
            </pre>
          </div>
        </div>
        <div className="roadmap-actions">
          <button onClick={onPrevious} className="btn btn-primary">
            {viewMode ? '← Back' : '🆕 Create New Roadmap'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-view">
      <div className="roadmap-header">
        <h1>🎯 Your Learning Roadmap is Ready!</h1>
        {(totalDays || milestones.length > 0) && (
          <div className="roadmap-meta">
            {totalDays && (
              <span className="duration-badge">
                ⏱️ {totalDays} days total
              </span>
            )}
            <span className="milestone-count">
              🎯 {milestones.length} milestones
            </span>
          </div>
        )}
      </div>

      <div className="roadmap-content">
        {milestones.map((milestone, index) => {
          // Flexible property extraction for each milestone
          const title = milestone.title || milestone.name || milestone.phase || `Phase ${index + 1}`;
          const description = milestone.description || milestone.desc || milestone.summary || '';
          const duration = milestone.estimatedDays || milestone.duration || milestone.days || '';
          const tasks = milestone.tasks || milestone.steps || milestone.activities || [];

          return (
            <div key={milestone.id || index} className="milestone-card">
              <div className="milestone-header">
                <span className="milestone-number">{index + 1}</span>
                <div className="milestone-info">
                  <h3>{title}</h3>
                  {duration && (
                    <div className="milestone-duration">
                      📅 {duration} {typeof duration === 'number' ? 'days' : ''}
                    </div>
                  )}
                </div>
              </div>
              
              {description && (
                <p className="milestone-description">{description}</p>
              )}
              
              {tasks && tasks.length > 0 && (
                <div className="milestone-tasks">
                  <h4>📋 Key Tasks</h4>
                  <ul className="task-list">
                    {tasks. map((task, taskIndex) => (
                      <li key={taskIndex} className="task-item">
                        {typeof task === 'string' ? task : task.title || task.name || JSON.stringify(task)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {resources && resources.length > 0 && (
          <div className="resources-section">
            <h2>📚 Recommended Resources</h2>
            <div className="resources-grid">
              {resources.map((resource, index) => {
                const name = resource.name || resource.title || `Resource ${index + 1}`;
                const link = resource.link || resource.url || '#';
                const type = resource. type || 'Resource';

                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <span className={`resource-badge ${type.toLowerCase()}`}>
                      {type}
                    </span>
                    <span className="resource-name">{name}</span>
                    <span className="external-link">↗</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="roadmap-actions">
        <button onClick={onPrevious} className="btn btn-primary">
          {viewMode ? '← Back to Dashboard' : '🆕 Create New Roadmap'}
        </button>
      </div>
    </div>
  );
};

export default StepFour;






