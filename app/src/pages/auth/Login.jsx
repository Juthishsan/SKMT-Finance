import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const inputStyle = {
    width: '100%',
    padding: '12px 40px 12px 40px',
    borderRadius: 12,
    border: '1.5px solid #c7d2fe',
    fontSize: 16,
    outline: 'none',
    background: '#f8fafc',
    boxShadow: '0 2px 8px rgba(30,58,138,0.04)',
    marginBottom: 0,
    transition: 'border 0.2s, box-shadow 0.2s',
  };
  const iconStyle = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    fontSize: 18,
    pointerEvents: 'none',
  };
  const inputGroupStyle = {
    position: 'relative',
    marginBottom: 0,
    width: '100%'
  };

  // Validation helpers
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = pw => pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);

  const validateFields = () => {
    const errors = {};
    if (!email || !validateEmail(email)) errors.email = 'Enter a valid email address.';
    if (!password || !validatePassword(password)) errors.password = 'Password must be at least 6 characters, include a letter, a number, and a symbol.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const response = await fetch(`http://localhost:5000/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Invalid email or password.');
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      toast.error('Login failed.');
      setError('Login failed.');
    }
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

  return (
    <div className="container" style={{maxWidth: 420, margin: '64px auto', padding: '40px', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)'}}>
      <h2 style={{textAlign: 'center', marginBottom: 28, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Login to SKMT Finance</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: 22}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Email</label>
          <div style={{...inputGroupStyle, marginBottom: 0}}>
            <FaEnvelope style={iconStyle} />
            <input
              type="email"
              style={{...inputStyle, border: fieldErrors.email ? '1.5px solid #ef4444' : inputStyle.border}}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              onFocus={e => e.target.style.border = fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
              onBlur={e => e.target.style.border = fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'}
            />
          </div>
          {fieldErrors.email && errorBox(fieldErrors.email)}
        </div>
        <div style={{marginBottom: 10}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Password</label>
          <div style={{...inputGroupStyle, marginBottom: 0}}>
            <FaLock style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              style={{...inputStyle, border: fieldErrors.password ? '1.5px solid #ef4444' : inputStyle.border}}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              onFocus={e => e.target.style.border = fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
              onBlur={e => e.target.style.border = fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'}
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
        <div style={{textAlign: 'right', marginBottom: 18}}>
          <Link
            to="/forgot-password"
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
              textDecoration: 'none',
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
          >
            Forgot Password?
          </Link>
        </div>
        {error && <div style={{color: 'red', marginBottom: 18, textAlign: 'center'}}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginBottom: 14, fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}}>Login</button>
        <div style={{
          textAlign: 'center',
          fontSize: 15,
          marginTop: 10,
          background: 'linear-gradient(90deg, #f0fdfa 0%, #e0e7ff 100%)',
          borderRadius: 12,
          padding: '12px 0',
          boxShadow: '0 2px 8px rgba(30,58,138,0.06)',
          fontWeight: 500,
          letterSpacing: 0.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <span style={{color: '#64748b'}}>Don't have an account?</span>{' '}
          <Link
            to="/register"
            style={{
              color: '#2563eb',
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 8,
              padding: '4px 14px',
              background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
              boxShadow: '0 2px 8px rgba(30,58,138,0.04)',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              marginLeft: 4,
              display: 'inline-block',
            }}
            onMouseOver={e => {
              e.target.style.background = 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)';
              e.target.style.color = '#fff';
              e.target.style.boxShadow = '0 4px 16px rgba(30,58,138,0.10)';
            }}
            onMouseOut={e => {
              e.target.style.background = 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)';
              e.target.style.color = '#2563eb';
              e.target.style.boxShadow = '0 2px 8px rgba(30,58,138,0.04)';
            }}
          >
            Register
          </Link>
        </div>
        {/* <div style={{textAlign: 'center', marginTop: 32}}>
          <a
            href="https://skmtadmin.vercel.app/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(90deg, #1e3a8a 0%, #38bdf8 100%)',
              color: '#fff',
              borderRadius: 30,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 1,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(30,58,138,0.10)',
              transition: 'background 0.3s, transform 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.target.style.background = 'linear-gradient(90deg, #38bdf8 0%, #1e3a8a 100%)';
              e.target.style.transform = 'scale(1.04)';
            }}
            onMouseOut={e => {
              e.target.style.background = 'linear-gradient(90deg, #1e3a8a 0%, #38bdf8 100%)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Admin Login
          </a>
        </div> */}
      </form>
    </div>
  );
};

export default Login; 
