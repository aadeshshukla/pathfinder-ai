import React, { useState } from 'react';
import ProgressBar from './components/progressBar'; // Corrected import path
import './components/PathfinderMVP.css'; // Corrected import path
import StepFour from './components/StepFour'; // Make sure StepFour is imported

const PathfinderMVP = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    skillLevel: 'Beginner',
    timeCommitment: '5 hours per week',
    learningStyle: 'Project-Based',
  });
  
  // --- NEW CODE ADDED HERE ---
  // State to hold the final roadmap data
  const [roadmapData, setRoadmapData] = useState(null); 
  // State to know when the AI is working
  const [isLoading, setIsLoading] = useState(false); 
  // State to handle any errors from the API call
  const [error, setError] = useState(null); 
  // --- END OF NEW CODE ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  
  const handlePrevious = () => {
    // When going back from the final step, reset everything
    if (currentStep === 4) {
      setRoadmapData(null);
      setError(null);
      setIsLoading(false);
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- THIS FUNCTION IS UPDATED ---
  const handleGenerate = async () => {
    setIsLoading(true); // Start loading
    setError(null);
    setRoadmapData(null);
    setCurrentStep(4); // Move to the results page to show the loading message

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle HTTP errors like 500
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRoadmapData(data); // Set the roadmap data
      
    } catch (e) {
      console.error('API Call Failed:', e);
      setError('Failed to generate the roadmap. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading, regardless of success or failure
    }
  };
  // --- END OF UPDATED FUNCTION ---

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-container">
            <h2>What's Your Learning Goal?</h2>
            <p>Be specific! e.g., "Become a full-stack web developer."</p>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., Learn AI-powered web applications"
            />
            <div className="navigation-buttons">
              <button onClick={handleNext} disabled={!formData.goal.trim()}>Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-container">
            <h2>Tell Us About Yourself</h2>
            <div className="input-group">
              <label>Your current skill level:</label>
              <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="input-group">
              <label>Time commitment per week:</label>
              <select name="timeCommitment" value={formData.timeCommitment} onChange={handleChange}>
                <option value="2-4 hours per week">Casual (2-4 hours)</option>
                <option value="5-8 hours per week">Moderate (5-8 hours)</option>
                <option value="10+ hours per week">Intensive (10+ hours)</option>
              </select>
            </div>
            <div className="input-group">
               <label>Preferred learning style:</label>
               <select name="learningStyle" value={formData.learningStyle} onChange={handleChange}>
                <option value="Project-Based">Project-Based</option>
                <option value="Structured Courses">Structured Courses</option>
                <option value="Reading Documentation">Reading Documentation</option>
              </select>
            </div>
            <div className="navigation-buttons">
              <button onClick={handlePrevious}>Previous</button>
              <button onClick={handleNext}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <h2>Ready to Generate?</h2>
            <p>Click below to create your personalized learning path.</p>
            <div className="navigation-buttons">
              <button onClick={handlePrevious}>Previous</button>
              <button onClick={handleGenerate}>Generate Roadmap</button>
            </div>
          </div>
        );
      case 4:
        // This now correctly passes all necessary info to StepFour
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
      <div className="app-header">
        <h1>Pathfinder AI</h1>
      </div>
      <ProgressBar currentStep={currentStep} totalSteps={4} />
      <div className="step-content">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default PathfinderMVP;

