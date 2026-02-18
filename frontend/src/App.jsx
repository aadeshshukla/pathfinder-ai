import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import Skeleton from './components/ui/Skeleton';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PathfinderMVP = lazy(() => import('./PathfinderMVP'));
const RoadmapView = lazy(() => import('./pages/RoadmapView'));
const MyRoadmaps = lazy(() => import('./pages/MyRoadmaps'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toast />
        <Suspense fallback={<Skeleton />}>
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
            
            <Route path="/roadmap/:id" element={
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
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;

