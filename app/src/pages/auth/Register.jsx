import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaFlag, FaLock, FaKey, FaHashtag, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    if (!name || !email || !password || !confirmPassword || !phone || !address || !city || !state || !pincode) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password, phone, address, city, state, pincode })
      });
      if (response.ok) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Registration failed.');
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      toast.error('Registration failed.');
      setError('Registration failed.');
    }
  };

  return (
    <div className="container" style={{maxWidth: 540, margin: '64px auto', padding: '40px', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)'}}>
      <h2 style={{textAlign: 'center', marginBottom: 28, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Name</label>
            <div style={inputGroupStyle}>
              <FaUser style={iconStyle} />
          <input
            type="text"
                style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
          />
        </div>
          </div>
          <div style={{flex: 1}}>
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
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Phone Number</label>
            <div style={inputGroupStyle}>
              <FaPhone style={iconStyle} />
              <input
                type="tel"
                style={inputStyle}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Address</label>
            <div style={inputGroupStyle}>
              <FaMapMarkerAlt style={iconStyle} />
              <input
                type="text"
                style={inputStyle}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your address"
                required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>City</label>
            <div style={inputGroupStyle}>
              <FaCity style={iconStyle} />
              <input
                type="text"
                style={inputStyle}
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City"
                required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>State</label>
            <div style={inputGroupStyle}>
              <FaFlag style={iconStyle} />
              <input
                type="text"
                style={inputStyle}
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="State"
                required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Pincode</label>
            <div style={inputGroupStyle}>
              <FaHashtag style={iconStyle} />
              <input
                type="text"
                style={inputStyle}
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Pincode"
                required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
            </div>
          </div>
          <div style={{flex: 1}}></div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Password</label>
            <div style={inputGroupStyle}>
              <FaLock style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
                style={inputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
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
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Confirm Password</label>
            <div style={inputGroupStyle}>
              <FaKey style={iconStyle} />
          <input
            type={showPassword ? 'text' : 'password'}
                style={inputStyle}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
                onFocus={e => e.target.style.border = '1.5px solid #1e3a8a'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
          />
            </div>
          </div>
        </div>
        <div style={{marginBottom: 18}}>
          <label style={{fontSize: 15}}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
              style={{marginRight: 8}}
            />
            I accept the <Link to="/terms" style={{color: '#1e3a8a'}}>terms and conditions</Link>
          </label>
        </div>
        {error && <div style={{color: 'red', marginBottom: 18, textAlign: 'center'}}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginBottom: 14, fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}}>Register</button>
        <div style={{textAlign: 'center', fontSize: 15}}>
          Already have an account?{' '}
          <Link to="/login" style={{color: '#1e3a8a'}}>Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 