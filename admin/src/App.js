import React from 'react';
import './App.css';
import './Theme.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import ScrollToTop from './ScrollToTop';
import AdminForgotPassword from './pages/auth/AdminForgotPassword';
import AdminResetPassword from './pages/auth/AdminResetPassword';

function App() {
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
