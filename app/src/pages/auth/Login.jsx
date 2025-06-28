import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
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

  return (
    <div className="container" style={{maxWidth: 420, margin: '64px auto', padding: '40px', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)'}}>
      <h2 style={{textAlign: 'center', marginBottom: 28, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Login to SKMT Finance</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: 22}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Email</label>
          <div style={inputGroupStyle}>
            <FaEnvelope style={iconStyle} />
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
        </div>
        <div style={{marginBottom: 10}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Password</label>
          <div style={inputGroupStyle}>
            <FaLock style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              style={inputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#1e3a8a', fontSize: 18, fontWeight: 600}}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div style={{textAlign: 'right', marginBottom: 18}}>
          <Link to="/forgot-password" style={{color: '#1e3a8a', fontSize: 14}}>Forgot Password?</Link>
        </div>
        {error && <div style={{color: 'red', marginBottom: 18, textAlign: 'center'}}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginBottom: 14, fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}}>Login</button>
        <div style={{textAlign: 'center', fontSize: 15}}>
          Don't have an account?{' '}
          <Link to="/register" style={{color: '#1e3a8a'}}>Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 