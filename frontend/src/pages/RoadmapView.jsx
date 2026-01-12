import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiShare2, FiTrash2, FiClock, FiTarget } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StepFour from '../components/StepFour';
import './RoadmapView.css';

const RoadmapView = () => {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchRoadmap();
    } else {
      console.warn('⚠️ No token found, redirecting to login');
      toast.error('Please log in to view roadmaps');
      navigate('/login');
    }
  }, [id, token]);

  const fetchRoadmap = async () => {
    try {
      console.log('🔍 Fetching roadmap:', id);
      console.log('🔑 Token exists:', !!token);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roadmap/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Roadmap fetch status:', response.status);

      if (response.status === 401) {
        console.warn('⚠️ Unauthorized - token may be expired');
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
        return;
      }

      if (!response. ok) {
        throw new Error(`Failed to fetch roadmap: ${response. status}`);
      }

      const data = await response.json();
      console.log('✅ Roadmap loaded successfully');
      setRoadmap(data);
    } catch (err) {
      console.error('❌ Error fetching roadmap:', err);
      setError(err.message);
      toast.error('Failed to load roadmap');
      // Don't navigate away immediately, show error state
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roadmap/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        toast.success('Roadmap deleted successfully');
        navigate('/dashboard');
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
      toast.error('Failed to delete roadmap');
    }
  };

  const handleExport = () => {
    toast.info('Export feature coming soon!  📄');
  };

  const handleShare = () => {
    navigator.clipboard. writeText(window.location.href);
    toast.success('Link copied to clipboard!  📋');
  };

  if (loading) {
    return (
      <div className="roadmap-view-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-view-page">
        <Navbar />
        <div className="error-container">
          <div className="error-content">
            <h2>⚠️ Error Loading Roadmap</h2>
            <p>{error}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="roadmap-view-page">
        <Navbar />
        <div className="error-container">
          <div className="error-content">
            <h2>📭 Roadmap Not Found</h2>
            <p>This roadmap doesn't exist or you don't have permission to view it. </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-view-page">
      <Navbar />
      
      <div className="roadmap-view-container">
        {/* Header */}
        <motion.div 
          className="roadmap-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            icon={<FiArrowLeft />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>

          <div className="roadmap-actions-group">
            <Button
              variant="ghost"
              icon={<FiShare2 />}
              onClick={handleShare}
            >
              Share
            </Button>
            <Button
              variant="ghost"
              icon={<FiDownload />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="danger"
              icon={<FiTrash2 />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </motion.div>

        {/* Roadmap Info Card */}
        <motion.div
          initial={{ opacity: 0, y:  20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="roadmap-info-card">
            <div className="info-header">
              <div>
                <h1>{roadmap.title}</h1>
                <p className="roadmap-date">
                  Created on {new Date(roadmap.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`skill-badge-large ${roadmap.skillLevel. toLowerCase()}`}>
                {roadmap.skillLevel}
              </span>
            </div>

            <div className="info-grid">
              <div className="info-box">
                <FiClock />
                <div>
                  <label>Time Commitment</label>
                  <p>{roadmap.timeCommitment}</p>
                </div>
              </div>
              <div className="info-box">
                <FiTarget />
                <div>
                  <label>Learning Style</label>
                  <p>{roadmap.learningStyle}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Roadmap Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity:  1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StepFour
            roadmapData={roadmap. roadmapData}
            isLoading={false}
            onPrevious={() => navigate('/dashboard')}
            viewMode={true}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapView;