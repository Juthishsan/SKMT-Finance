import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  // Password validation (same as Register page)
  const validatePassword = pw =>
    pw.length >= 6 &&
    /[A-Za-z]/.test(pw) &&
    /\d/.test(pw); // at least one symbol

  const [fieldErrors, setFieldErrors] = useState({});

  const handleBlur = (field, value) => {
    let msg = '';
    if (field === 'password' && !validatePassword(value)) msg = 'Password must be at least 6 characters, include a letter and a number.';
    if (field === 'confirmPassword' && value !== password) msg = 'Passwords do not match.';
    setFieldErrors(prev => ({ ...prev, [field]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters, include a letter and a number.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successful!');
        navigate('/login');
      } else {
        toast.error(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: 420, margin: '64px auto', padding: '40px', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)'}}>
      <h2 style={{textAlign: 'center', marginBottom: 28, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: 22}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setFieldErrors(prev => ({...prev, password: ''})); }}
            placeholder="Enter new password"
            required
            style={{width: '100%', padding: '12px', borderRadius: 12, border: fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe', fontSize: 16, outline: 'none', background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.04)'}}
            onBlur={e => handleBlur('password', e.target.value)}
          />
          {fieldErrors.password && (
            <div style={{ color: '#b91c1c', background: 'linear-gradient(90deg, #fef2f2 60%, #f0fdfa 100%)', border: '1.5px solid #fca5a5', borderLeft: '6px solid #ef4444', borderRadius: 10, padding: '10px 16px', marginTop: 8, fontSize: 15, fontWeight: 600, boxShadow: '0 4px 16px #fca5a522', letterSpacing: 0.2, animation: 'fadeInError 0.5s' }}>
              {fieldErrors.password}
              <style>{`@keyframes fadeInError { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </div>
          )}
        </div>
        <div style={{marginBottom: 22}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setFieldErrors(prev => ({...prev, confirmPassword: ''})); }}
            placeholder="Confirm new password"
            required
            style={{width: '100%', padding: '12px', borderRadius: 12, border: fieldErrors.confirmPassword ? '1.5px solid #ef4444' : '1.5px solid #c7d2fe', fontSize: 16, outline: 'none', background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.04)'}}
            onBlur={e => handleBlur('confirmPassword', e.target.value)}
          />
          {fieldErrors.confirmPassword && (
            <div style={{ color: '#b91c1c', background: 'linear-gradient(90deg, #fef2f2 60%, #f0fdfa 100%)', border: '1.5px solid #fca5a5', borderLeft: '6px solid #ef4444', borderRadius: 10, padding: '10px 16px', marginTop: 8, fontSize: 15, fontWeight: 600, boxShadow: '0 4px 16px #fca5a522', letterSpacing: 0.2, animation: 'fadeInError 0.5s' }}>
              {fieldErrors.confirmPassword}
              <style>{`@keyframes fadeInError { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%', fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; 