import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
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
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            style={{width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #c7d2fe', fontSize: 16, outline: 'none', background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.04)'}}
          />
        </div>
        <div style={{marginBottom: 22}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            style={{width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #c7d2fe', fontSize: 16, outline: 'none', background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.04)'}}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%', fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; 