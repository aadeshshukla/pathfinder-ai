import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState(localStorage.getItem('guestMode') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.removeItem('guestMode');
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
    return data;
  };

  const register = async (username, email, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.removeItem('guestMode');
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
    return data;
  };

  const continueAsGuest = () => {
    localStorage.removeItem('token');
    localStorage.setItem('guestMode', 'true');
    setToken(null);
    setUser(null);
    setIsGuest(true);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    setToken(null);
    setUser(null);
    setIsGuest(false);
  };

  const requestPasswordReset = async (email) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to request password reset');
    }

    return data;
  };

  const resetPassword = async (tokenValue, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: tokenValue, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  };

  const value = {
    user,
    token,
    isGuest,
    loading,
    login,
    register,
    continueAsGuest,
    logout,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
