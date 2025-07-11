import React from 'react';
import './App.css';
import './Theme.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import ScrollToTop from './ScrollToTop';
import AdminForgotPassword from './pages/auth/AdminForgotPassword';
import AdminResetPassword from './pages/auth/AdminResetPassword';
import LoadingSpinner from './components/LoadingSpinner';
import { useState, useEffect } from 'react';

function App() {
  const [appLoading, setAppLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 600); // Simulate initial load
    return () => clearTimeout(timer);
  }, []);
  if (appLoading) return <LoadingSpinner fullscreen text="Loading Admin Panel..." />;

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Routes>
          <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin-reset-password/:token" element={<AdminResetPassword />} />
          <Route path="*" element={<AuthProvider />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
