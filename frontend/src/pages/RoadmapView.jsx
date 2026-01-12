import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StepFour from '../components/StepFour';
import './RoadmapView.css';

const RoadmapView = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`${import.meta.env. VITE_API_BASE_URL}/roadmap/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="loading-container">Loading roadmap...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={handleBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="roadmap-view-container">
      <StepFour
        roadmapData={roadmap?. roadmapData}
        isLoading={false}
        error={null}
        onPrevious={handleBack}
      />
    </div>
  );
};

export default RoadmapView;