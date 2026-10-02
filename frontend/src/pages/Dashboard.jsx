import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiClock, FiTarget, FiTrendingUp, FiGrid, FiList, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchTerm, setSearchTerm] = useState('');
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

      if (!response.ok) throw new Error('Failed to fetch roadmaps');

      const data = await response.json();
      setRoadmaps(data. roadmaps);
    } catch (err) {
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roadmap/${roadmapId}`, {
        method: 'DELETE',
        headers:  {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRoadmaps(roadmaps.filter(r => r._id !== roadmapId));
        toast.success('Roadmap deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete roadmap');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredRoadmaps = roadmaps.filter(roadmap =>
    roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.skillLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Roadmaps', value: roadmaps.length, icon: <FiTarget />, color: '#6366f1' },
    { label: 'This Month', value: roadmaps.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length, icon: <FiClock />, color: '#10b981' },
    { label: 'Skills Learning', value: new Set(roadmaps.map(r => r.skillLevel)).size, icon: <FiTrendingUp />, color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity:  1, y: 0 }}
        >
          <div className="welcome-content">
            <h1>Welcome back, {user?.username}!  👋</h1>
            <p>Continue your learning journey where you left off</p>
          </div>
          <Button 
            icon={<FiPlus />} 
            onClick={() => navigate('/create')}
            size="lg"
          >
            Create New Roadmap
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity:  1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="stat-card">
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Roadmaps Section */}
        <div className="roadmaps-section">
          <div className="section-header">
            <h2>Your Roadmaps</h2>
            <div className="section-controls">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your roadmaps...</p>
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">📚</div>
              <h3>{searchTerm ? 'No roadmaps found' : 'No roadmaps yet'}</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Create your first personalized learning roadmap!'}</p>
              {! searchTerm && (
                <Button icon={<FiPlus />} onClick={() => navigate('/create')}>
                  Create Your First Roadmap
                </Button>
              )}
            </motion.div>
          ) : (
            <div className={`roadmaps-${viewMode}`}>
              {filteredRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap._id}
                  initial={{ opacity: 0, y:  20 }}
                  animate={{ opacity: 1, y:  0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="roadmap-card">
                    <div className="roadmap-card-header">
                      <h3>{roadmap.title}</h3>
                      <span className={`skill-badge ${roadmap.skillLevel.toLowerCase()}`}>
                        {roadmap.skillLevel}
                      </span>
                    </div>
                    
                    <div className="roadmap-card-info">
                      <div className="info-item">
                        <FiClock />
                        <span>{roadmap.timeCommitment}</span>
                      </div>
                      <div className="info-item">
                        <FiTarget />
                        <span>{roadmap.learningStyle}</span>
                      </div>
                    </div>

                    <div className="roadmap-card-footer">
                      <span className="roadmap-date">{formatDate(roadmap.createdAt)}</span>
                      <div className="roadmap-actions">
                        <Button
                          size="sm"
                          icon={<FiEye />}
                          onClick={() => navigate(`/roadmap/${roadmap._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<FiTrash2 />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(roadmap._id, roadmap.title);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;