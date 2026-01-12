import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiSearch, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './MyRoadmaps.css';

const MyRoadmaps = () => {
  const { token } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
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

      if (! response.ok) throw new Error('Failed to fetch roadmaps');

      const data = await response.json();
      setRoadmaps(data. roadmaps);
    } catch (err) {
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId, title) => {
    if (!window.confirm(`Delete "${title}"? `)) return;

    try {
      const response = await fetch(`${import.meta.env. VITE_API_BASE_URL}/roadmap/${roadmapId}`, {
        method: 'DELETE',
        headers: {
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

  const filteredRoadmaps = roadmaps
    .filter(roadmap => 
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.skillLevel.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(roadmap => 
      filter === 'all' || roadmap.skillLevel. toLowerCase() === filter
    );

  return (
    <div className="my-roadmaps-page">
      <Navbar />
      
      <div className="my-roadmaps-container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>My Roadmaps</h1>
            <p>All your learning paths in one place</p>
          </div>
          <Button
            icon={<FiPlus />}
            size="lg"
            onClick={() => navigate('/create')}
          >
            Create New
          </Button>
        </motion.div>

        <motion.div
          className="controls-section"
          initial={{ opacity:  0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="search-filter-group">
            <div className="search-box-large">
              <FiSearch />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="view-toggle-large">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid /> Grid
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <FiList /> List
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your roadmaps...</p>
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <motion.div 
            className="empty-state-large"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">📚</div>
            <h3>{searchTerm || filter !== 'all' ? 'No roadmaps found' : 'No roadmaps yet'}</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ?  'Try adjusting your search or filter' 
                : 'Create your first personalized learning roadmap! '}
            </p>
            {! searchTerm && filter === 'all' && (
              <Button icon={<FiPlus />} size="lg" onClick={() => navigate('/create')}>
                Create Your First Roadmap
              </Button>
            )}
          </motion. div>
        ) : (
          <div className={`roadmaps-${viewMode}-view`}>
            {filteredRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="roadmap-item">
                  <div className="roadmap-item-header">
                    <h3>{roadmap.title}</h3>
                    <span className={`skill-badge ${roadmap.skillLevel.toLowerCase()}`}>
                      {roadmap.skillLevel}
                    </span>
                  </div>
                  
                  <div className="roadmap-item-meta">
                    <span>⏰ {roadmap.timeCommitment}</span>
                    <span>📚 {roadmap.learningStyle}</span>
                    <span>📅 {formatDate(roadmap. createdAt)}</span>
                  </div>

                  <div className="roadmap-item-actions">
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
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoadmaps;