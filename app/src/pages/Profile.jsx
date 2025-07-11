import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaFlag, FaHashtag, FaEdit, FaSave, FaTimes, FaMoneyCheckAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (user?.email) {
      setLoansLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/user-loan-applications?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setLoans(Array.isArray(data) ? data : []))
        .catch(() => setLoans([]))
        .finally(() => setLoansLoading(false));
      // Fetch all orders and filter by user email
      setOrdersLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/orders`)
        .then(res => res.json())
        .then(async data => {
          let filtered = Array.isArray(data) ? data.filter(o => o.userSnapshot?.email === user.email) : [];
          // For any order where productSnapshot is a string, fetch the product details
          const updatedOrders = await Promise.all(filtered.map(async order => {
            if (order.productSnapshot && typeof order.productSnapshot === 'string') {
              try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${order.productSnapshot}`);
                if (res.ok) {
                  const prod = await res.json();
                  return { ...order, productSnapshot: prod };
                }
              } catch {}
            }
            return order;
          }));
          setOrders(updatedOrders);
        })
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [user, isAuthenticated, navigate]);

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
    // Simple validation
    if (!form.phone || !/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }
    if (!form.pincode || !/^\d{5,6}$/.test(form.pincode)) {
      toast.error('Enter a valid 5 or 6 digit pincode.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode
        })
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
    <div className="profile-bg">
      <div className="profile-sections">
        {/* Profile Card - Top */}
        <motion.div
          className="profile-card-modern"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.45, duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0, fontSize: 28 }}>Profile</h2>
          </div>
          <div style={{ padding: 20}}>
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
        </motion.div>
        {/* Loans List - Middle */}
        <motion.div
          className="profile-card-modern"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.45, duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', padding: '24px 0 14px 0', textAlign: 'center' }}>
              <h3 className="loans-title" style={{ color: '#fff', fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: 1 }}>My Loan Applications</h3>
            </div>
          <div style={{ padding: 0 }}>
              {loansLoading ? (
                <div className="text-center">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading your loans...</p>
                </div>
              ) : loans.length === 0 ? (
                <div className="no-loans" style={{ textAlign: 'center', color: '#64748b', padding: 18 }}>
                  <div className="no-loans-icon" style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                  <p>No loan applications found.</p>
                  <p>Apply for a loan to see your applications here.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  {loans.map((loan, index) => (
                    <div key={index} className="loan-item" style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #1e3a8a11', padding: 20, borderLeft: '4px solid #3b82f6', transition: 'box-shadow 0.18s, transform 0.18s', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 16px #1e3a8a22'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px #1e3a8a11'; e.currentTarget.style.transform = 'none'; }}>
                      <div className="loan-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="loan-type" style={{ fontWeight: 700, color: '#1e3a8a', fontSize: 17 }}>{loan.loanType}</span>
                        <span className={`loan-status ${getLoanStatus(loan).toLowerCase()}`} style={{ display: 'inline-block', padding: '2px 12px', borderRadius: 8, background: getLoanStatus(loan) === 'Approved' ? '#10b981' : getLoanStatus(loan) === 'Rejected' ? '#dc2626' : '#f97316', color: '#fff', fontWeight: 600, fontSize: 15, letterSpacing: 0.5 }}>{getLoanStatus(loan)}</span>
                      </div>
                      <div className="loan-details" style={{ marginBottom: 8 }}>
                        <div className="loan-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontWeight: 500, fontSize: 15 }}>
                          <FaMoneyCheckAlt className="loan-detail-icon" />
                          <span>Amount: ₹{loan.amount?.toLocaleString()}</span>
                        </div>
                        <div className="loan-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontWeight: 500, fontSize: 15 }}>
                          <FaCalendarAlt className="loan-detail-icon" />
                          <span>Applied: {new Date(loan.createdAt).toLocaleDateString()}</span>
                        </div>
                        {loan.status === 'Approved' && (
                          <div className="loan-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontWeight: 500, fontSize: 15 }}>
                            <FaCheckCircle className="loan-detail-icon" />
                            <span>Approved on: {new Date(loan.updatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {loan.status === 'Pending' && (
                          <div className="loan-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f97316', fontWeight: 500, fontSize: 15 }}>
                            <FaClock className="loan-detail-icon" />
                            <span>Under review</span>
                          </div>
                        )}
                      </div>
                      <div className="loan-amount" style={{ fontWeight: 700, color: '#1e3a8a', fontSize: 16 }}>Loan Amount: ₹{loan.amount?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </motion.div>
        {/* Orders List - Bottom */}
        <motion.div
          className="profile-card-modern"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.45, duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', padding: '24px 0 14px 0', textAlign: 'center' }}>
              <h3 className="loans-title" style={{ color: '#fff', fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: 1 }}>My Orders</h3>
            </div>
          <div style={{ padding: 0 }}>
              {ordersLoading ? (
                <div className="text-center">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="no-loans" style={{ textAlign: 'center', color: '#64748b', padding: 18 }}>
                  <div className="no-loans-icon" style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
                  <p>No orders found.</p>
                  <p>Order a product to see it here.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  {orders.map((order, idx) => (
                    <div key={order._id || idx} className="loan-item" style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #1e3a8a11', padding: 20, borderLeft: '4px solid #3b82f6', transition: 'box-shadow 0.18s, transform 0.18s', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 16px #1e3a8a22'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 8px #1e3a8a11'; e.currentTarget.style.transform = 'none'; }}>
                      <div className="loan-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="loan-type" style={{ fontWeight: 700, color: '#1e3a8a', fontSize: 17 }}>{order.productSnapshot?.name || 'Product'}</span>
                        <span className={`loan-status ${order.orderstatus ? order.orderstatus.toLowerCase() : 'pending'}`} style={{ display: 'inline-block', padding: '2px 12px', borderRadius: 8, background: order.orderstatus === 'Approved' ? '#10b981' : order.orderstatus === 'Rejected' ? '#dc2626' : '#f97316', color: '#fff', fontWeight: 600, fontSize: 15, letterSpacing: 0.5 }}>{order.orderstatus || 'Pending'}</span>
                      </div>
                      <div className="loan-details" style={{ marginBottom: 8 }}>
                        <div className="loan-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontWeight: 500, fontSize: 15 }}>
                          <FaMoneyCheckAlt className="loan-detail-icon" />
                          <span>Price: ₹{order.productSnapshot?.price?.toLocaleString() || '-'}</span>
                        </div>
                        <div className="loan-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontWeight: 500, fontSize: 15 }}>
                          <FaCalendarAlt className="loan-detail-icon" />
                          <span>Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 