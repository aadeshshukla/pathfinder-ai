import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PathfinderMVP from './PathfinderMVP';
import RoadmapView from './pages/RoadmapView';
import MyRoadmaps from './pages/MyRoadmaps';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/create" element={
            <ProtectedRoute>
              <PathfinderMVP />
            </ProtectedRoute>
          } />
          
          <Route path="/roadmap/: id" element={
            <ProtectedRoute>
              <RoadmapView />
            </ProtectedRoute>
          } />
          
          <Route path="/my-roadmaps" element={
            <ProtectedRoute>
              <MyRoadmaps />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

