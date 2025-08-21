import React from 'react';
import './StepFour.css'; // We'll create this CSS file next

const StepFour = ({ roadmapData, onPrevious }) => {
  if (!roadmapData) {
    return (
      <div className="step">
        <h2>Generating your roadmap...</h2>
        <p>Please wait a moment.</p>
        <div className="navigation-buttons">
          <button onClick={onPrevious}>Previous</button>
        </div>
      </div>
    );
  }

  return (
    <div className="step roadmap-container">
      <h2>Your Personalized Learning Roadmap:</h2>
      <p className="roadmap-intro">{roadmapData.introduction}</p>

      {roadmapData.modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="module-card">
          <h3>{module.module_title}</h3>
          <p className="module-duration"><strong>Estimated Duration:</strong> {module.duration}</p>
          <p className="module-description">{module.description}</p>

          {module.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="topic-card">
              <h4>{topic.topic_name}</h4>
              <p>{topic.description}</p>
              
              <ul className="resource-list">
                {topic.resources.map((resource, resourceIndex) => (
                  <li key={resourceIndex}>
                    <span className={`resource-type resource-${resource.type.toLowerCase()}`}>{resource.type}</span>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      
      <div className="navigation-buttons">
        <button onClick={onPrevious}>Go Back</button>
      </div>
    </div>
  );
};

export default StepFour;






