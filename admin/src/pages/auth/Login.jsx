import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../AuthProvider';
import { FaExclamationCircle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const getTokenData = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

const Login = ({ componentrender }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, token, admin } = useAuth();
  const [fieldErrors, setFieldErrors] = useState({});
  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (admin && token) {
      const data = getTokenData(token);
      if (data && data.exp && Date.now() < data.exp * 1000) {
        componentrender('Dashboard');
      }
    }
    // eslint-disable-next-line
  }, [admin, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation helpers
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Change password validation: at least 6 chars, must include a letter and a number (no symbol required)
  const validatePassword = pw => pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw);

  const validateFields = () => {
    const errors = {};
    if (!formData.email || !validateEmail(formData.email)) errors.email = 'Enter a valid email address.';
    if (!formData.password || !validatePassword(formData.password)) errors.password = 'Password must be at least 6 characters, include a letter and a number.';
    return errors;
  };

  // Per-field validation on blur
  const handleBlur = (field, value) => {
    let msg = '';
    if (field === 'email' && !validateEmail(value)) msg = 'Enter a valid email address.';
    if (field === 'password' && !validatePassword(value)) msg = 'Password must be at least 6 characters, include a letter and a number.';
    setFieldErrors(prev => ({ ...prev, [field]: msg }));
  };

  const errorBox = msg => (
    <div style={{
      color: '#b91c1c',
      background: 'linear-gradient(90deg, #fef2f2 60%, #f0fdfa 100%)',
      border: '1.5px solid #fca5a5',
      borderLeft: '6px solid #ef4444',
      borderRadius: 10,
      padding: '10px 16px',
      marginTop: 8,
      marginBottom: 0,
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontWeight: 600,
      boxShadow: '0 4px 16px #fca5a522',
      letterSpacing: 0.2,
      transition: 'all 0.3s',
      animation: 'fadeInError 0.5s',
    }}>
      <FaExclamationCircle style={{fontSize: 18, color: '#ef4444', flexShrink: 0}} />
      <span>{msg}</span>
      <style>{`
        @keyframes fadeInError {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/admin-login`, formData);
      const data = response.data;
      setLoading(false);
      login(data.admin, data.token);
      setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Logged in Successfully',
        showConfirmButton: true,
        timer: 2000
      });
      }, 100);
      componentrender('Dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Username or Password is Wrong');
      setTimeout(() => {
      Swal.fire({
        icon: 'error',
        title: err.response?.data?.error || 'Username or Password is Wrong',
        showConfirmButton: true,
        timer: 2000
      });
      }, 100);
    }
  };

  if (loading) return <LoadingSpinner fullscreen text="Logging in..." />;

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
            <div style={{position: 'relative', marginBottom: 0}}>
              <FaEnvelope style={{position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 18, pointerEvents: 'none'}} />
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
                  border: fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe',
                  padding: '10px 12px 10px 40px',
                  fontSize: 16,
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'border 0.2s',
                  width: '100%',
                }}
                onFocus={e => e.target.style.border = fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('email', e.target.value); }}
              />
            </div>
            {fieldErrors.email && errorBox(fieldErrors.email)}
          </div>
          <div className="form-group" style={{marginBottom: 10}}>
            <label style={{fontWeight: 500, color: '#1e3a8a'}}>Password</label>
            <div style={{position: 'relative', marginBottom: 0}}>
              <FaLock style={{position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 18, pointerEvents: 'none'}} />
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
                  border: fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe',
                  padding: '10px 12px 10px 40px',
                  fontSize: 16,
                  outline: 'none',
                  boxShadow: 'none',
                  width: '100%',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.border = fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('password', e.target.value); }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#1e3a8a', fontSize: 18, fontWeight: 600}}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {fieldErrors.password && errorBox(fieldErrors.password)}
          </div>
          <div style={{textAlign: 'right', marginBottom: 10}}>
            <span
              style={{
                color: '#2563eb',
                fontSize: 15,
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: 8,
                padding: '6px 16px',
                background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
                boxShadow: '0 2px 8px rgba(30,58,138,0.06)',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                display: 'inline-block',
                border: 'none',
                outline: 'none',
              }}
              onMouseOver={e => {
                e.target.style.background = 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)';
                e.target.style.color = '#fff';
                e.target.style.boxShadow = '0 4px 16px rgba(30,58,138,0.10)';
              }}
              onMouseOut={e => {
                e.target.style.background = 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)';
                e.target.style.color = '#2563eb';
                e.target.style.boxShadow = '0 2px 8px rgba(30,58,138,0.06)';
              }}
              onClick={() => componentrender('AdminForgotPassword')}
            >
              Forgot Password?
            </span>
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
