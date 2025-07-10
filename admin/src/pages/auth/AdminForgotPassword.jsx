import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin-forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Reset link sent!', text: 'Check your email for the reset link.' });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to send reset link.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send reset link.' });
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: '100%', borderRadius: 20 }}>
        <h2 className="fw-bold mb-4 text-center" style={{ color: '#1e3a8a' }}>Admin Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminForgotPassword; 