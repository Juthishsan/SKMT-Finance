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
      <div className="profile-container">
        <div className="profile-card-empty">
          <h2>No user data found</h2>
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

  const getLoanStatus = (loan) => {
    if (loan.processed === true) return 'Approved';
    if (loan.processed === false) return 'Pending';
    return 'Pending';
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Profile Card - Left */}
        <div className="profile-card">
          <div className="profile-avatar-large">
            <span className="profile-avatar-text">
              {user.username ? user.username[0].toUpperCase() : '?'}
            </span>
          </div>
          <h2 className="profile-name">{user.username}</h2>
          <div className="profile-fields">
            <div className="profile-field">
              <FaUser className="profile-field-icon" />
              <span className="profile-field-label">Name</span>
              {editMode ? (
                <input 
                  name="username" 
                  value={form.username || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.username}</span>
              )}
            </div>
            <div className="profile-field">
              <FaEnvelope className="profile-field-icon" />
              <span className="profile-field-label">Email</span>
              {editMode ? (
                <input 
                  name="email" 
                  value={form.email || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.email}</span>
              )}
            </div>
            <div className="profile-field">
              <FaPhone className="profile-field-icon" />
              <span className="profile-field-label">Phone</span>
              {editMode ? (
                <input 
                  name="phone" 
                  value={form.phone || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.phone}</span>
              )}
            </div>
            <div className="profile-field">
              <FaMapMarkerAlt className="profile-field-icon" />
              <span className="profile-field-label">Address</span>
              {editMode ? (
                <input 
                  name="address" 
                  value={form.address || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.address}</span>
              )}
            </div>
            <div className="profile-field">
              <FaCity className="profile-field-icon" />
              <span className="profile-field-label">City</span>
              {editMode ? (
                <input 
                  name="city" 
                  value={form.city || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.city}</span>
              )}
            </div>
            <div className="profile-field">
              <FaFlag className="profile-field-icon" />
              <span className="profile-field-label">State</span>
              {editMode ? (
                <input 
                  name="state" 
                  value={form.state || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.state}</span>
              )}
            </div>
            <div className="profile-field">
              <FaHashtag className="profile-field-icon" />
              <span className="profile-field-label">Pincode</span>
              {editMode ? (
                <input 
                  name="pincode" 
                  value={form.pincode || ''} 
                  onChange={handleChange} 
                  className="profile-field-input" 
                />
              ) : (
                <span className="profile-field-value">{user.pincode}</span>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="profile-save-btn"
                >
                  <FaSave style={{marginRight: 8}} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="profile-cancel-btn"
                >
                  <FaTimes style={{marginRight: 8}} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="profile-edit-btn"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {/* Loans List - Right */}
        <div className="loans-section">
          <div className="loans-card">
            <h3 className="loans-title">
              <FaMoneyCheckAlt /> My Loan Applications
            </h3>
            
            {loansLoading ? (
              <div className="text-center">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading your loans...</p>
              </div>
            ) : loans.length === 0 ? (
              <div className="no-loans">
                <div className="no-loans-icon">📋</div>
                <p>No loan applications found.</p>
                <p>Apply for a loan to see your applications here.</p>
              </div>
            ) : (
              loans.map((loan, index) => (
                <div key={index} className="loan-item">
                  <div className="loan-header">
                    <span className="loan-type">{loan.loanType}</span>
                    <span className={`loan-status ${getLoanStatus(loan).toLowerCase()}`}>
                      {getLoanStatus(loan)}
                    </span>
                  </div>
                  
                  <div className="loan-details">
                    <div className="loan-detail">
                      <FaMoneyCheckAlt className="loan-detail-icon" />
                      <span>Amount: ₹{loan.amount?.toLocaleString()}</span>
                    </div>
                    <div className="loan-detail">
                      <FaCalendarAlt className="loan-detail-icon" />
                      <span>Applied: {new Date(loan.createdAt).toLocaleDateString()}</span>
                    </div>
                    {loan.status === 'Approved' && (
                      <div className="loan-detail">
                        <FaCheckCircle className="loan-detail-icon" />
                        <span>Approved on: {new Date(loan.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {loan.status === 'Pending' && (
                      <div className="loan-detail">
                        <FaClock className="loan-detail-icon" />
                        <span>Under review</span>
                      </div>
                    )}
                    </div>
                  
                  <div className="loan-amount">
                    Loan Amount: ₹{loan.amount?.toLocaleString()}
                  </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 