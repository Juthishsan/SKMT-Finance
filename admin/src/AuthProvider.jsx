import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Login from './pages/auth/Login';
import Engine from './Engine';
import ForgotPassword from './pages/auth/ForgotPassword';
import SessionWarningModal from './components/SessionWarningModal';
import AdminForgotPassword from './pages/auth/AdminForgotPassword';
import AdminResetPassword from './pages/auth/AdminResetPassword';
//import Swal from 'sweetalert2';

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
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [sessionWarning, setSessionWarning] = useState(false);
  const [component, setComponent] = useState(() => (admin ? 'Engine' : 'Login'));
  const [engineSubComponent, setEngineSubComponent] = useState(() => localStorage.getItem('adminPanelPage') || 'Dashboard');
  const logoutTimer = useRef();
  const warningTimer = useRef();
  const inactivityTimer = useRef();

  // Helper: Logout
  const logout = useCallback(() => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    setSessionWarning(false);
    setComponent('Login');
    window.location.reload(); // Force reload to clear all state
  }, []);

  // Helper: Reset inactivity timer (now 2 hours)
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, 2 * 60 * 60 * 1000); // 2 hours
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

  // Remove token expiry-based logout and warning
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

  // On mount and on token/admin change, ensure authentication is valid
  useEffect(() => {
    if (!admin || !token) {
      setComponent('Login');
    } else {
      // Optionally, check token validity here as well
      const data = getTokenData(token);
      if (!data || !data.exp || Date.now() > data.exp * 1000) {
        setComponent('Login');
        setAdmin(null);
        setToken(null);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
      }
    }
    // eslint-disable-next-line
  }, [admin, token]);

  // Login handler
  const login = (adminData, jwt) => {
    setAdmin(adminData);
    setToken(jwt);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', jwt);
    if (adminData && adminData.email) {
      localStorage.setItem('adminEmail', adminData.email);
    }
    setSessionWarning(false);
    setComponent('Engine');
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

  // Component navigation logic
  useEffect(() => {
    if (component === 'Engine') {
      localStorage.setItem('adminPanelPage', engineSubComponent);
    }
  }, [component, engineSubComponent]);

  const componentrender = (componentName) => {
    if ([
      'Dashboard', 'Products', 'Orders', 'Loans', 'Users', 'Admins', 'Profile', 'ContactMessages', 'VehicleSales'
    ].includes(componentName)) {
      setComponent('Engine');
      setEngineSubComponent(componentName);
    } else {
      setComponent(componentName);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, authFetch, sessionWarning, setSessionWarning, componentrender }}>
      <div className=''>
        <div></div>
        <div>
          {component === 'Login' && <Login componentrender={componentrender} />}
          {component === 'Engine' && <Engine component={engineSubComponent} componentrender={componentrender} />}
          {component === 'ForgotPassword' && <ForgotPassword componentrender={componentrender} />}
          {component === 'AdminForgotPassword' && <AdminForgotPassword componentrender={componentrender} />}
          {component === 'AdminResetPassword' && <AdminResetPassword componentrender={componentrender} />}
        </div>
        <div></div>
      </div>
      {sessionWarning && (
        <SessionWarningModal onDismiss={() => setSessionWarning(false)} />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;