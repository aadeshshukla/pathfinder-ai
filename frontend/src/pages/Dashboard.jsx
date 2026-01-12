import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/pathfinder-logo.png';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roadmap`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmaps');
      }

      const data = await response.json();
      setRoadmaps(data.roadmaps);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId) => {
    if (! window.confirm('Are you sure you want to delete this roadmap?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roadmap/${roadmapId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRoadmaps(roadmaps.filter(r => r._id !== roadmapId));
      }
    } catch (err) {
      console.error('Failed to delete roadmap:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="branding">
          <img src={logo} alt="Pathfinder AI" className="app-logo" />
          <div className="branding-text">
            <h1>Pathfinder AI</h1>
            <p>Dashboard</p>
          </div>
        </div>
        <div className="user-menu">
          <span className="user-name">👋 {user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <h2>Your Learning Roadmaps</h2>
          <button 
            onClick={() => navigate('/create')} 
            className="btn-create"
          >
            ✨ Create New Roadmap
          </button>
        </div>

        {loading && <div className="loading">Loading your roadmaps...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && roadmaps.length === 0 && (
          <div className="empty-state">
            <p>🎯 You haven't created any roadmaps yet</p>
            <p>Click "Create New Roadmap" to get started! </p>
          </div>
        )}

        <div className="roadmaps-grid">
          {roadmaps.map((roadmap) => (
            <div key={roadmap._id} className="roadmap-card">
              <div className="roadmap-header">
                <h3>{roadmap.title}</h3>
                <span className="roadmap-level">{roadmap.skillLevel}</span>
              </div>
              
              <div className="roadmap-info">
                <p><strong>⏰ Time:</strong> {roadmap.timeCommitment}</p>
                <p><strong>📚 Style:</strong> {roadmap.learningStyle}</p>
                <p><strong>📅 Created:</strong> {formatDate(roadmap.createdAt)}</p>
              </div>

              <div className="roadmap-actions">
                <button 
                  onClick={() => navigate(`/roadmap/${roadmap._id}`)}
                  className="btn-view"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDelete(roadmap._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;