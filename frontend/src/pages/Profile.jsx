import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // TODO: Implement profile update API
    toast.info('Profile update feature coming soon! ');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity:  1, y: 0 }}
        >
          <h1 className="page-title">My Profile</h1>
          
          <div className="profile-grid">
            {/* Profile Info Card */}
            <Card className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{user?.username}</h2>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <FiCalendar />
                  <div>
                    <label>Member Since</label>
                    <p>{new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
              </div>

              {! isEditing ? (
                <Button
                  icon={<FiEdit2 />}
                  fullWidth
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="edit-actions">
                  <Button
                    variant="secondary"
                    icon={<FiX />}
                    onClick={handleCancel}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    icon={<FiSave />}
                    onClick={handleSave}
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </Card>

            {/* Account Details Card */}
            <Card className="details-card">
              <h3>Account Details</h3>
              
              {isEditing ? (
                <div className="form-fields">
                  <div className="form-group">
                    <label>
                      <FiUser /> Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FiMail /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="detail-items">
                  <div className="detail-item">
                    <label><FiUser /> Username</label>
                    <p>{user?.username}</p>
                  </div>
                  <div className="detail-item">
                    <label><FiMail /> Email</label>
                    <p>{user?.email}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </motion. div>
      </div>
    </div>
  );
};

export default Profile;