import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiUser, FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { useAuth } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import StepFour from './components/StepFour';
import './components/PathfinderMVP.css';

const PathfinderMVP = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    skillLevel: 'Beginner',
    timeCommitment: '5 hours per week',
    learningStyle: 'Project-Based',
  });
  
  const [roadmapData, setRoadmapData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };
  
  const handlePrevious = () => {
    if (currentStep === 4) {
      navigate('/dashboard');
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setRoadmapData(null);
    setCurrentStep(4);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/roadmap`;
      const response = await fetch(apiUrl, {
        method:  'POST',
        headers:  {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRoadmapData(data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      toast.success('Roadmap created successfully!  🎉');
      
    } catch (e) {
      console.error('API Call Failed:', e);
      toast.error('Failed to generate the roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const skillLevels = [
    { value: 'Beginner', icon: '🌱', description: 'Just starting out' },
    { value:  'Intermediate', icon: '🌿', description: 'Some experience' },
    { value:  'Advanced', icon: '🌳', description: 'Expert level' },
  ];

  const learningStyles = [
    { value: 'Project-Based', icon: '🛠️', description: 'Learn by building' },
    { value: 'Theory-First', icon: '📚', description: 'Understand concepts first' },
    { value:  'Video Tutorials', icon: '🎥', description: 'Visual learning' },
    { value: 'Reading Documentation', icon: '📖', description: 'Deep dive into docs' },
  ];

  const popularGoals = [
    'Learn Full-Stack Web Development',
    'Master Machine Learning',
    'Become a Mobile App Developer',
    'Learn Data Science',
    'Master DevOps',
    'Learn Cybersecurity',
  ];

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="step-container"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <div className="step-icon">
                <FiTarget />
              </div>
              <div className="step-header">
                <h2>What's Your Learning Goal?</h2>
                <p>Be specific about what you want to achieve</p>
              </div>
              
              <div className="form-content">
                <div className="form-group-custom">
                  <textarea
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    placeholder="e. g., Learn full-stack web development to build modern web applications"
                    className="goal-textarea"
                    rows="4"
                  />
                  <span className="char-count">{formData.goal.length} characters</span>
                </div>

                <div className="popular-goals">
                  <p className="popular-label">Popular goals:</p>
                  <div className="goal-chips">
                    {popularGoals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        className="goal-chip"
                        onClick={() => setFormData({... formData, goal})}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="step-actions">
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                  icon={<FiArrowLeft />}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!formData.goal. trim()}
                  icon={<FiArrowRight />}
                >
                  Next Step
                </Button>
              </div>
            </Card>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div 
            className="step-container"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <div className="step-icon">
                <FiUser />
              </div>
              <div className="step-header">
                <h2>Tell Us About Yourself</h2>
                <p>Help us customize your learning path</p>
              </div>
              
              <div className="form-content">
                {/* Skill Level */}
                <div className="form-section">
                  <label className="section-label">What's your skill level?</label>
                  <div className="option-cards">
                    {skillLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        className={`option-card ${formData.skillLevel === level.value ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, skillLevel: level.value})}
                      >
                        <span className="option-icon">{level.icon}</span>
                        <h4>{level.value}</h4>
                        <p>{level.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Commitment */}
                <div className="form-section">
                  <label className="section-label">How much time can you commit?</label>
                  <select 
                    name="timeCommitment" 
                    value={formData.timeCommitment} 
                    onChange={handleChange}
                    className="custom-select"
                  >
                    <option value="5 hours per week">⏰ 5 hours/week - Weekend warrior</option>
                    <option value="10 hours per week">⏱️ 10 hours/week - Steady progress</option>
                    <option value="15 hours per week">⏲️ 15 hours/week - Accelerated</option>
                    <option value="20+ hours per week">🕐 20+ hours/week - Full immersion</option>
                  </select>
                </div>

                {/* Learning Style */}
                <div className="form-section">
                  <label className="section-label">What's your learning style?</label>
                  <div className="option-cards">
                    {learningStyles. map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        className={`option-card ${formData.learningStyle === style.value ?  'active' : ''}`}
                        onClick={() => setFormData({...formData, learningStyle: style.value})}
                      >
                        <span className="option-icon">{style.icon}</span>
                        <h4>{style.value}</h4>
                        <p>{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="step-actions">
                <Button 
                  variant="secondary"
                  onClick={handlePrevious}
                  icon={<FiArrowLeft />}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  icon={<FiArrowRight />}
                >
                  Review & Generate
                </Button>
              </div>
            </Card>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div 
            className="step-container"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <div className="step-icon">
                <FiCheckCircle />
              </div>
              <div className="step-header">
                <h2>Ready to Generate? </h2>
                <p>Review your selections and create your personalized roadmap</p>
              </div>
              
              <div className="summary-content">
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-icon">🎯</span>
                    <div>
                      <label>Learning Goal</label>
                      <p>{formData.goal}</p>
                    </div>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-icon">📊</span>
                    <div>
                      <label>Skill Level</label>
                      <p>{formData.skillLevel}</p>
                    </div>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-icon">⏰</span>
                    <div>
                      <label>Time Commitment</label>
                      <p>{formData.timeCommitment}</p>
                    </div>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-icon">📚</span>
                    <div>
                      <label>Learning Style</label>
                      <p>{formData.learningStyle}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="step-actions">
                <Button 
                  variant="secondary"
                  onClick={handlePrevious}
                  icon={<FiArrowLeft />}
                >
                  Previous
                </Button>
                <Button 
                  variant="success"
                  onClick={handleGenerate}
                  size="lg"
                  icon={<FiCheckCircle />}
                >
                  Generate My Roadmap
                </Button>
              </div>
            </Card>
          </motion.div>
        );
        
      case 4:
        return (
          <StepFour
            roadmapData={roadmapData}
            isLoading={isLoading}
            onPrevious={handlePrevious}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="pathfinder-container">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <Navbar />
      
      <div className="pathfinder-content">
        {currentStep < 4 && (
          <div className="progress-section">
            <div className="progress-steps">
              {[1, 2, 3]. map((step) => (
                <div 
                  key={step} 
                  className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                >
                  <div className="step-number">{step}</div>
                  <span className="step-label">
                    {step === 1 ? 'Goal' : step === 2 ?  'Profile' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PathfinderMVP;


