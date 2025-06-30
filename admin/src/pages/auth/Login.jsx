import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = ({ componentrender }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    Swal.fire({
      html: `
        <div class="p-5">
          <div class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `,
      showConfirmButton: false,
      background: 'transparent',
      timer: 800,
    });
    try {
      await axios.post('http://localhost:5000/api/admin-login', formData);
      localStorage.setItem('adminEmail', formData.email);
      Swal.fire({
        icon: 'success',
        title: 'Logged in Successfully',
        showConfirmButton: true,
        timer: 2000
      });
      componentrender("Dashboard");
    } catch (err) {
      setError(err.response?.data?.error || 'Username or Password is Wrong');
      Swal.fire({
        icon: 'error',
        title: err.response?.data?.error || 'Username or Password is Wrong',
        showConfirmButton: true,
        timer: 2000
      });
    }
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
        {/* <img
          src={require('../../public/Images/logo5.png')}
          alt="Admin Logo"
          style={{ width: 64, height: 64, marginBottom: 12, borderRadius: 12, boxShadow: '0 2px 8px #1e3a8a22' }}
        /> */}
        <h2 style={{textAlign: 'center', marginBottom: 18, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Admin Login</h2>
        <form onSubmit={handleLoginSubmit} style={{width: '100%'}} autoComplete="off">
          <div className="form-group" style={{marginBottom: 18}}>
            <label style={{fontWeight: 500, color: '#1e3a8a'}}>Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              name="email"
              required
              style={{
                marginTop: 6,
                borderRadius: 8,
                border: '1.5px solid #c7d2fe',
                padding: '10px 12px',
                fontSize: 16,
                outline: 'none',
                boxShadow: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
          <div className="form-group" style={{marginBottom: 10}}>
            <label style={{fontWeight: 500, color: '#1e3a8a'}}>Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                name="password"
                required
                style={{
                  marginTop: 6,
                  borderRadius: 8,
                  border: '1.5px solid #c7d2fe',
                  padding: '10px 12px',
                  fontSize: 16,
                  outline: 'none',
                  boxShadow: 'none',
                  width: '100%',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: 14,
                  cursor: 'pointer',
                  color: showPassword ? '#1e3a8a' : '#64748b',
                  fontWeight: 600,
                  fontSize: 15,
                  userSelect: 'none',
                  transition: 'color 0.2s',
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="#1e3a8a" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 0 1 5.17-5.61M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-5.97"/><path d="M12 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 0 1-5.17 5.61"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="3.5" ry="3.5"/><path d="M2 12C3.73 7.61 7 5 12 5s8.27 2.61 10 7c-1.73 4.39-5 7-10 7s-8.27-2.61-10-7z"/></svg>
                )}
              </span>
            </div>
          </div>
          {error && <div style={{color: '#ef4444', marginBottom: 16, textAlign: 'center', fontWeight: 500}}>{error}</div>}
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
          }}>LOGIN</button>
        </form>
        <div style={{marginTop: 18, color: '#64748b', fontSize: 14, textAlign: 'center', letterSpacing: 0.2}}>
          SKMT Finance Admin Panel &copy; {new Date().getFullYear()}
        </div>
      </div>
      {/* Fade-in animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
