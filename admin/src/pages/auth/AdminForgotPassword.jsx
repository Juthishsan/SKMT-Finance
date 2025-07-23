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
      const res = await fetch(`${API_URL}/api/admins/forgot-password`, {
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
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.5s',
    }}>
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          padding: '40px 32px 32px 32px',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 8px 32px rgba(30,58,138,0.18)',
          border: '1.5px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both',
        }}
      >
        <img
          src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png"
          alt="SKMT Logo"
          style={{ width: 64, height: 64, marginBottom: 12, borderRadius: 12, boxShadow: '0 2px 8px #1e3a8a22', objectFit: 'cover' }}
        />
        <h2 style={{textAlign: 'center', marginBottom: 18, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Admin Forgot Password</h2>
        <form onSubmit={handleSubmit} style={{width: '100%'}} autoComplete="off">
          <div className="form-group" style={{marginBottom: 18}}>
            <label style={{fontWeight: 500, color: '#1e3a8a'}}>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              required
              disabled={loading}
              style={{
                marginTop: 6,
                borderRadius: 8,
                border: '1.5px solid #c7d2fe',
                padding: '10px 12px',
                fontSize: 16,
                outline: 'none',
                boxShadow: 'none',
                transition: 'border 0.2s',
                width: '100%',
              }}
              onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{
            width: '100%',
            margin: '18px 0 8px 0',
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
            boxShadow: '0 4px 16px rgba(30,58,138,0.10)',
            letterSpacing: 1,
            transition: 'background 0.2s, transform 0.2s',
          }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div style={{marginTop: 18, color: '#64748b', fontSize: 14, textAlign: 'center', letterSpacing: 0.2}}>
          SKMT Finance Admin Panel &copy; {new Date().getFullYear()}
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminForgotPassword; 