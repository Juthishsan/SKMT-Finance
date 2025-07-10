import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaFlag, FaLock, FaKey, FaHashtag, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import TermsModal from '../../components/TermsModal';

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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Dropdown visibility state
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

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

  const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
  ];
  const CITIES = [
    'Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Manglore', 'Erode', 'Belgaum', 'Kurnool', 'Ambattur', 'Rajahmundry', 'Tirunelveli', 'Malegaon', 'Gaya', 'Udaipur', 'Maheshtala'
  ];

  const [cityInput, setCityInput] = useState('');
  const [stateInput, setStateInput] = useState('');

  // Validation helpers
  const validateName = name => /^[A-Za-z\s]{2,}$/.test(name);
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = phone => /^\d{10}$/.test(phone);
  const validatePincode = pincode => /^\d{5,6}$/.test(pincode);
  // Change password validation: at least 6 chars, must include a letter and a number (no symbol required)
  const validatePassword = pw => pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw);

  const validateFields = () => {
    const errors = {};
    if (!name || !validateName(name)) errors.name = 'Name is required (letters only, min 2 characters).';
    if (!email || !validateEmail(email)) errors.email = 'Enter a valid email address.';
    if (!phone || !validatePhone(phone)) errors.phone = 'Enter a valid 10-digit phone number.';
    if (!address || address.trim().length < 5) errors.address = 'Address is required (min 5 characters).';
    if (!city) errors.city = 'City is required.';
    if (!state) errors.state = 'State is required.';
    if (!pincode || !validatePincode(pincode)) errors.pincode = 'Enter a valid 5 or 6 digit pincode.';
    if (!password || !validatePassword(password)) errors.password = 'Password must be at least 6 characters, include a letter and a number.';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.';
    if (!acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/users`, {
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

  // Per-field validation on blur
  const handleBlur = (field, value) => {
    let msg = '';
    if (field === 'name' && !validateName(value)) msg = 'Name is required (letters only, min 2 characters).';
    if (field === 'email' && !validateEmail(value)) msg = 'Enter a valid email address.';
    if (field === 'phone' && !validatePhone(value)) msg = 'Enter a valid 10-digit phone number.';
    if (field === 'address' && (!value || value.trim().length < 5)) msg = 'Address is required (min 5 characters).';
    if (field === 'city' && !value) msg = 'City is required.';
    if (field === 'state' && !value) msg = 'State is required.';
    if (field === 'pincode' && !validatePincode(value)) msg = 'Enter a valid 5 or 6 digit pincode.';
    if (field === 'password' && !validatePassword(value)) msg = 'Password must be at least 6 characters, include a letter and a number.';
    if (field === 'confirmPassword' && value !== password) msg = 'Passwords do not match.';
    setFieldErrors(prev => ({ ...prev, [field]: msg }));
  };

  return (
    <div className="container" style={{maxWidth: 540, margin: '64px auto', padding: '40px', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)'}}>
      <h2 style={{textAlign: 'center', marginBottom: 28, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Name</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaUser style={iconStyle} />
              <input
                type="text"
                style={{...inputStyle, border: fieldErrors.name ? '1.5px solid #ef4444' : inputStyle.border}}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                required
                onFocus={e => e.target.style.border = fieldErrors.name ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.name ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('name', e.target.value); }}
              />
            </div>
            {fieldErrors.name && errorBox(fieldErrors.name)}
          </div>
          <div style={{flex: 1}}>
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
                onBlur={e => { e.target.style.border = fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('email', e.target.value); }}
              />
            </div>
            {fieldErrors.email && errorBox(fieldErrors.email)}
          </div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Phone Number</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaPhone style={iconStyle} />
              <input
                type="tel"
                style={{...inputStyle, border: fieldErrors.phone ? '1.5px solid #ef4444' : inputStyle.border}}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                onFocus={e => e.target.style.border = fieldErrors.phone ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.phone ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('phone', e.target.value); }}
              />
            </div>
            {fieldErrors.phone && errorBox(fieldErrors.phone)}
          </div>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Address</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaMapMarkerAlt style={iconStyle} />
              <input
                type="text"
                style={{...inputStyle, border: fieldErrors.address ? '1.5px solid #ef4444' : inputStyle.border}}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your address"
                required
                onFocus={e => e.target.style.border = fieldErrors.address ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.address ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('address', e.target.value); }}
              />
            </div>
            {fieldErrors.address && errorBox(fieldErrors.address)}
          </div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>City</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaCity style={iconStyle} />
              <input
                type="text"
                style={{...inputStyle, border: fieldErrors.city ? '1.5px solid #ef4444' : inputStyle.border}}
                value={cityInput}
                onChange={e => {
                  setCityInput(e.target.value);
                  setCity(e.target.value);
                  setShowCityDropdown(true);
                }}
                placeholder="Search or select city"
                autoComplete="off"
                required
                onFocus={e => { e.target.style.border = fieldErrors.city ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'; setShowCityDropdown(true); }}
                onBlur={e => { e.target.style.border = fieldErrors.city ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; setTimeout(() => setShowCityDropdown(false), 150); handleBlur('city', e.target.value); }}
              />
              {showCityDropdown && cityInput && (
                <div style={{position: 'absolute', top: 48, left: 0, right: 0, background: '#fff', border: '1.5px solid #c7d2fe', borderRadius: 10, zIndex: 10, maxHeight: 180, overflowY: 'auto', boxShadow: '0 4px 16px #1e3a8a22'}}>
                  {CITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).slice(0, 8).map(c => (
                    <div
                      key={c}
                      style={{padding: '10px 18px', cursor: 'pointer', color: '#1e3a8a', fontWeight: 500, borderBottom: '1px solid #f1f5f9'}}
                      onMouseDown={e => {
                        setCityInput(c); setCity(c); setShowCityDropdown(false);
                      }}
                    >
                      {c}
                    </div>
                  ))}
                  {CITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).length === 0 && (
                    <div style={{padding: '10px 18px', color: '#64748b'}}>No results</div>
                  )}
                </div>
              )}
            </div>
            {fieldErrors.city && errorBox(fieldErrors.city)}
          </div>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>State</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaFlag style={iconStyle} />
              <input
                type="text"
                style={{...inputStyle, border: fieldErrors.state ? '1.5px solid #ef4444' : inputStyle.border}}
                value={stateInput}
                onChange={e => {
                  setStateInput(e.target.value);
                  setState(e.target.value);
                  setShowStateDropdown(true);
                }}
                placeholder="Search or select state"
                autoComplete="off"
                required
                onFocus={e => { e.target.style.border = fieldErrors.state ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'; setShowStateDropdown(true); }}
                onBlur={e => { e.target.style.border = fieldErrors.state ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; setTimeout(() => setShowStateDropdown(false), 150); handleBlur('state', e.target.value); }}
              />
              {showStateDropdown && stateInput && (
                <div style={{position: 'absolute', top: 48, left: 0, right: 0, background: '#fff', border: '1.5px solid #c7d2fe', borderRadius: 10, zIndex: 10, maxHeight: 180, overflowY: 'auto', boxShadow: '0 4px 16px #1e3a8a22'}}>
                  {STATES.filter(s => s.toLowerCase().includes(stateInput.toLowerCase())).slice(0, 8).map(s => (
                    <div
                      key={s}
                      style={{padding: '10px 18px', cursor: 'pointer', color: '#1e3a8a', fontWeight: 500, borderBottom: '1px solid #f1f5f9'}}
                      onMouseDown={e => {
                        setStateInput(s); setState(s); setShowStateDropdown(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                  {STATES.filter(s => s.toLowerCase().includes(stateInput.toLowerCase())).length === 0 && (
                    <div style={{padding: '10px 18px', color: '#64748b'}}>No results</div>
                  )}
                </div>
              )}
            </div>
            {fieldErrors.state && errorBox(fieldErrors.state)}
          </div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Pincode</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaHashtag style={iconStyle} />
              <input
                type="text"
                style={{...inputStyle, border: fieldErrors.pincode ? '1.5px solid #ef4444' : inputStyle.border}}
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Pincode"
                required
                onFocus={e => e.target.style.border = fieldErrors.pincode ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.pincode ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('pincode', e.target.value); }}
              />
            </div>
            {fieldErrors.pincode && errorBox(fieldErrors.pincode)}
          </div>
          <div style={{flex: 1}}></div>
        </div>
        <div style={{display: 'flex', gap: 18, marginBottom: 18}}>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Password</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaLock style={iconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                style={{...inputStyle, border: fieldErrors.password ? '1.5px solid #ef4444' : inputStyle.border}}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                onFocus={e => e.target.style.border = fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('password', e.target.value); }}
              />
            </div>
            {fieldErrors.password && errorBox(fieldErrors.password)}
          </div>
          <div style={{flex: 1}}>
            <label style={{fontWeight: 600, color: '#1e3a8a'}}>Confirm Password</label>
            <div style={{...inputGroupStyle, marginBottom: 0}}>
              <FaKey style={iconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                style={{...inputStyle, border: fieldErrors.confirmPassword ? '1.5px solid #ef4444' : inputStyle.border}}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                onFocus={e => e.target.style.border = fieldErrors.confirmPassword ? '1.5px solid #ef4444' : '1.5px solid #1e3a8a'}
                onBlur={e => { e.target.style.border = fieldErrors.confirmPassword ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe'; handleBlur('confirmPassword', e.target.value); }}
              />
            </div>
            {fieldErrors.confirmPassword && errorBox(fieldErrors.confirmPassword)}
          </div>
        </div>
        <div style={{marginBottom: 18, display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #f0fdfa 0%, #e0e7ff 100%)', borderRadius: 10, padding: '10px 16px', boxShadow: '0 2px 8px rgba(30,58,138,0.06)'}}>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={e => setAcceptTerms(e.target.checked)}
            style={{marginRight: 10, accentColor: '#2563eb', width: 18, height: 18, borderRadius: 4, border: fieldErrors.acceptTerms ? '1.5px solid #ef4444' : '1.5px solid #2563eb'}}
          />
          <span style={{fontSize: 15, color: '#334155', fontWeight: 500}}>
            I accept the{' '}
            <span
              style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer'}}
              onClick={e => { e.preventDefault(); setShowTermsModal(true); }}
            >
              terms and conditions
            </span>
          </span>
          {fieldErrors.acceptTerms && errorBox(fieldErrors.acceptTerms)}
        </div>
        <TermsModal
          open={showTermsModal}
          onAccept={() => { setAcceptTerms(true); setShowTermsModal(false); }}
          onClose={() => setShowTermsModal(false)}
        />
        {error && <div style={{color: 'red', marginBottom: 18, textAlign: 'center'}}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginBottom: 14, fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}}>Register</button>
        <div style={{
          textAlign: 'center',
          fontSize: 15,
          marginTop: 10,
          background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
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
          <span style={{color: '#64748b'}}>Already have an account?</span>{' '}
          <Link
            to="/login"
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
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 