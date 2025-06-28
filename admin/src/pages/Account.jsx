import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Account = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assume admin email is stored in localStorage after login
    const email = localStorage.getItem('adminEmail');
    if (!email) {
      setLoading(false);
      return;
    }
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admins`);
        const found = res.data.find(a => a.email === email);
        setAdmin(found);
      } catch (err) {
        setAdmin(null);
      }
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  const handleResetPassword = () => {
    Swal.fire({
      icon: 'info',
      title: 'Change Password',
      text: 'Password change feature coming soon.',
        showConfirmButton: true,
      confirmButtonColor: '#1e3a8a',
    });
  };

  if (loading) {
    return <div className="container text-center py-5">Loading profile...</div>;
  }

  if (!admin) {
    return <div className="container text-center py-5">No admin profile found.</div>;
  }

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: '100%', borderRadius: 20 }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 48, color: '#1e3a8a', fontWeight: 700 }}>{admin.name ? admin.name[0].toUpperCase() : '?'}</span>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#1e3a8a' }}>{admin.name}</h2>
          <div className="text-muted mb-2">{admin.email}</div>
              </div>
        <div className="mb-3">
          <label className="fw-bold">Phone</label>
          <div className="mb-2">{admin.phone || <span className="text-muted">Not set</span>}</div>
            </div>
        <div className="d-flex flex-column gap-2 mt-4">
          <button className="btn btn-outline-primary w-100" onClick={handleResetPassword} disabled>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Account;
