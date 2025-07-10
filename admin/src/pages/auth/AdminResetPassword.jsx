import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Password reset successful!' });
        navigate('/admin-login');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to reset password.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to reset password.' });
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: '100%', borderRadius: 20 }}>
        <h2 className="fw-bold mb-4 text-center" style={{ color: '#1e3a8a' }}>Admin Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword; 