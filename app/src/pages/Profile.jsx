import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaFlag, FaHashtag, FaEdit, FaSave, FaTimes, FaMoneyCheckAlt, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const Profile = () => {
  const [user, setUser] = useState(getUser());
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      setLoansLoading(true);
      fetch(`http://localhost:5000/api/user-loan-applications?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setLoans(Array.isArray(data) ? data : []))
        .catch(() => setLoans([]))
        .finally(() => setLoansLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="profile-card-empty">
          <h2 style={{ color: '#1e3a8a', fontWeight: 700 }}>No user data found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setEditMode(false);
        toast.success('Profile updated!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Update failed.');
      }
    } catch (err) {
      toast.error('Update failed.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm(user);
    setEditMode(false);
  };

  const fieldStyle = {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18
  };
  const labelStyle = {
    minWidth: 90, color: '#1e3a8a', fontWeight: 600, fontSize: 15
  };
  const valueStyle = {
    color: '#222', fontSize: 16, flex: 1
  };
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #c7d2fe', fontSize: 16, outline: 'none', background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.04)', transition: 'border 0.2s', flex: 1
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', padding: '48px 0' }}>
      <div style={{ display: 'flex', gap: 40, width: '100%', maxWidth: 1200, alignItems: 'flex-start' }}>
        {/* Profile Card - Left */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(30,58,138,0.13)',
          padding: '48px 40px',
          maxWidth: 420,
          width: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}>
          <div style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c7d2fe 0%, #f0fdfa 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 2px 8px #1e3a8a22',
          }}>
            <span style={{ fontSize: 54, color: '#1e3a8a', fontWeight: 700 }}>
              {user.username ? user.username[0].toUpperCase() : '?'}
            </span>
          </div>
          <h2 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 0 }}>{user.username}</h2>
          <div style={{ width: '100%', marginTop: 18 }}>
            <div style={fieldStyle}><FaUser style={{color:'#64748b'}} /><span style={labelStyle}>Name</span>{editMode ? <input name="username" value={form.username || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.username}</span>}</div>
            <div style={fieldStyle}><FaEnvelope style={{color:'#64748b'}} /><span style={labelStyle}>Email</span>{editMode ? <input name="email" value={form.email || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.email}</span>}</div>
            <div style={fieldStyle}><FaPhone style={{color:'#64748b'}} /><span style={labelStyle}>Phone</span>{editMode ? <input name="phone" value={form.phone || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.phone}</span>}</div>
            <div style={fieldStyle}><FaMapMarkerAlt style={{color:'#64748b'}} /><span style={labelStyle}>Address</span>{editMode ? <input name="address" value={form.address || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.address}</span>}</div>
            <div style={fieldStyle}><FaCity style={{color:'#64748b'}} /><span style={labelStyle}>City</span>{editMode ? <input name="city" value={form.city || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.city}</span>}</div>
            <div style={fieldStyle}><FaFlag style={{color:'#64748b'}} /><span style={labelStyle}>State</span>{editMode ? <input name="state" value={form.state || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.state}</span>}</div>
            <div style={fieldStyle}><FaHashtag style={{color:'#64748b'}} /><span style={labelStyle}>Pincode</span>{editMode ? <input name="pincode" value={form.pincode || ''} onChange={handleChange} style={inputStyle} /> : <span style={valueStyle}>{user.pincode}</span>}</div>
          </div>
          <div style={{ marginTop: 18, width: '100%', display: 'flex', gap: 12, justifyContent: 'center' }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    padding: '10px 32px',
                    background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: 1,
                    boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  <FaSave style={{marginRight: 8}} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    padding: '10px 32px',
                    background: '#f3f4f6',
                    color: '#1e3a8a',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: 1,
                    boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  <FaTimes style={{marginRight: 8}} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: 1,
                  boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
        {/* Loans List - Right */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', padding: '32px 32px', minHeight: 320 }}>
            <h3 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 24, textAlign: 'left' }}>Your Loan Applications</h3>
            {loansLoading ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: 32 }}>Loading loans...</div>
            ) : loans.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>No loan applications found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {loans.map(loan => (
                  <div key={loan._id} style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#f8fafc', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 8px rgba(30,58,138,0.04)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: 17, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><FaMoneyCheckAlt /> {loan.loanType}</div>
                      <div style={{ color: '#222', fontSize: 15, marginBottom: 2 }}>Amount: <b>₹{loan.amount?.toLocaleString?.() || loan.amount}</b></div>
                      <div style={{ color: '#64748b', fontSize: 14, marginBottom: 2 }}>Applied on: <FaCalendarAlt style={{marginRight: 4}} /> {new Date(loan.createdAt).toLocaleDateString()}</div>
                      <div style={{ color: loan.processed ? '#16a34a' : '#f59e42', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {loan.processed ? <FaCheckCircle /> : <FaClock />} {loan.processed ? 'Processed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 