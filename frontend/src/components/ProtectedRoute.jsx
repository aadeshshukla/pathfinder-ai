import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowGuest = false }) => {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const persistedGuestMode = typeof window !== 'undefined' && localStorage.getItem('guestMode') === 'true';

  if (loading) {
    return (
      <div className="protected-route-loading" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading your session...</p>
      </div>
    );
  }

  return isAuthenticated || (allowGuest && (isGuest || persistedGuestMode)) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
