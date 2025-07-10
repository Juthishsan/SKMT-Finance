import { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        toast.success('Password reset link sent! Check your email.');
      } else {
        toast.error(data.error || 'Failed to send reset link.');
      }
    } catch (err) {
      toast.error('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: 420, margin: '64px auto', padding: '40px', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)'}}>
      <h2 style={{textAlign: 'center', marginBottom: 28, color: '#1e3a8a', fontWeight: 700, letterSpacing: 1}}>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: 22}}>
          <label style={{fontWeight: 600, color: '#1e3a8a'}}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #c7d2fe', fontSize: 16, outline: 'none', background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.04)'}}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%', fontWeight: 700, fontSize: 18, borderRadius: 10, letterSpacing: 1, boxShadow: '0 2px 8px rgba(30,58,138,0.08)'}} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {success && <div style={{color: 'green', marginTop: 18, textAlign: 'center'}}>Check your email for the reset link.</div>}
      </form>
    </div>
  );
};

export default ForgotPassword; 