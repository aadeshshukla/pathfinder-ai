import React, { useState } from 'react';
import logo from './assets/pathfinder-logo.png'; 
import ProgressBar from './components/progressBar';
import './components/PathfinderMVP.css';
import StepFour from './components/StepFour';

const PathfinderMVP = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    skillLevel: 'Beginner',
    timeCommitment: '5 hours per week',
    learningStyle: 'Project-Based',
  });
  
  const [roadmapData, setRoadmapData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  
  const handlePrevious = () => {
    if (currentStep === 4) {
      setRoadmapData(null);
      setError(null);
      setIsLoading(false);
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setRoadmapData(null);
    setCurrentStep(4);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/roadmap`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRoadmapData(data);
      
    } catch (e) {
      console.error('API Call Failed:', e);
      setError('Failed to generate the roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-container compact">
            <div className="step-header">
              <h2>🎯 What's Your Learning Goal?</h2>
              <p>Be specific about what you want to achieve</p>
            </div>
            
            <div className="form-content">
              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="e.g., Learn full-stack web development"
                className="form-input"
              />
            </div>
            
            <div className="step-actions">
              <button 
                onClick={handleNext} 
                disabled={!formData.goal.trim()}
                className="btn btn-primary"
              >
                Next →
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-container compact">
            <div className="step-header">
              <h2>👤 Tell Us About Yourself</h2>
              <p>Help us customize your learning path</p>
            </div>
            
            <div className="form-content">
              <div className="form-row">
                <label className="form-label">Skill Level</label>
                <select 
                  name="skillLevel" 
                  value={formData.skillLevel} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Beginner">🌱 Beginner</option>
                  <option value="Intermediate">🌿 Intermediate</option>
                  <option value="Advanced">🌳 Advanced</option>
                </select>
              </div>
              
              <div className="form-row">
                <label className="form-label">Time Commitment</label>
                <select 
                  name="timeCommitment" 
                  value={formData.timeCommitment} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="5 hours per week">⏰ 5 hours/week</option>
                  <option value="10 hours per week">⏱️ 10 hours/week</option>
                  <option value="15 hours per week">⏲️ 15 hours/week</option>
                  <option value="20+ hours per week">🕐 20+ hours/week</option>
                </select>
              </div>
              
              <div className="form-row">
                <label className="form-label">Learning Style</label>
                <select 
                  name="learningStyle" 
                  value={formData.learningStyle} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Project-Based">🛠️ Project-Based</option>
                  <option value="Theory-First">📚 Theory-First</option>
                  <option value="Video Tutorials">🎥 Video Tutorials</option>
                  <option value="Reading Documentation">📖 Documentation</option>
                </select>
              </div>
            </div>
            
            <div className="step-actions">
              <button onClick={handlePrevious} className="btn btn-secondary">
                ← Previous
              </button>
              <button onClick={handleNext} className="btn btn-primary">
                Next →
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-container compact">
            <div className="step-header">
              <h2>🚀 Ready to Generate?</h2>
              <p>Let's create your personalized learning roadmap</p>
            </div>
            
            <div className="summary-card">
              <h3>📋 Your Profile</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-label">Goal:</span>
                  <span className="summary-value">{formData.goal}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Level:</span>
                  <span className="summary-value">{formData.skillLevel}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time:</span>
                  <span className="summary-value">{formData.timeCommitment}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Style:</span>
                  <span className="summary-value">{formData.learningStyle}</span>
                </div>
              </div>
            </div>
            
            <div className="step-actions">
              <button onClick={handlePrevious} className="btn btn-secondary">
                ← Previous
              </button>
              <button onClick={handleGenerate} className="btn btn-success">
                🎯 Generate Roadmap
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <StepFour
            roadmapData={roadmapData}
            isLoading={isLoading}
            error={error}
            onPrevious={handlePrevious}
           
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="pathfinder-container">
      <header className="app-header">
        <div className="branding">
          <img
            src={logo}
            alt="Pathfinder AI Logo"
            className="app-logo"
            loading="eager"
            decoding="async"
          />
          <div className="branding-text">
            <h1>Pathfinder AI</h1>
            <p>Your Personalized Learning Journey</p>
          </div>
        </div>
      </header>

      <ProgressBar currentStep={currentStep} totalSteps={4} />
      <div className="step-content">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default PathfinderMVP;

