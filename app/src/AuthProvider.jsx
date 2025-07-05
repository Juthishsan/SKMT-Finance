import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const getTokenData = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [sessionWarning, setSessionWarning] = useState(false);
  const logoutTimer = useRef();
  const warningTimer = useRef();
  const inactivityTimer = useRef();

  // Helper: Logout
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setSessionWarning(false);
    navigate('/login');
  }, [navigate]);

  // Helper: Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, 15 * 60 * 1000); // 15 min
  }, [logout]);

  // Set up inactivity listeners
  useEffect(() => {
    if (!token) return;
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetInactivityTimer));
    resetInactivityTimer();
    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [token, resetInactivityTimer]);

  // Set up token expiry and warning
  useEffect(() => {
    if (!token) return;
    const data = getTokenData(token);
    if (!data || !data.exp) {
      logout();
      return;
    }
    const exp = data.exp * 1000;
    const now = Date.now();
    const msToExpiry = exp - now;
    if (msToExpiry <= 0) {
      logout();
      return;
    }
    // Show warning 1 min before expiry
    if (warningTimer.current) clearTimeout(warningTimer.current);
    warningTimer.current = setTimeout(() => setSessionWarning(true), Math.max(msToExpiry - 60 * 1000, 0));
    // Auto-logout at expiry
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => logout(), msToExpiry);
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [token, logout]);

  // Login handler
  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);
    setSessionWarning(false);
  };

  // Attach token to fetch requests
  const authFetch = useCallback(
    (url, options = {}) => {
      const headers = options.headers || {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      return fetch(url, { ...options, headers });
    },
    [token]
  );

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authFetch, sessionWarning, setSessionWarning, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 