import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthProvider';

const Account = () => {
  const { admin, authFetch, login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: admin?.name || '', phone: admin?.phone || '' });

  // Fetch latest admin data on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      if (!admin?._id) return;
      try {
        const res = await authFetch(`http://localhost:5000/api/admins`);
        if (!res.ok) return;
        const data = await res.json();
        const found = data.find(a => a._id === admin._id);
        if (found) {
          login(found, token);
        }
      } catch {}
    };
    fetchAdmin();
    // eslint-disable-next-line
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

  const handleEdit = () => {
    setForm({ name: admin?.name || '', phone: admin?.phone || '' });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:5000/api/admins/${admin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      // Update context
      login(updated, token);
      setEditMode(false);
      Swal.fire({ icon: 'success', title: 'Profile updated!', timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to update profile', text: err.message });
    }
    setLoading(false);
  };

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
          {editMode ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control mb-2 text-center"
              style={{ fontWeight: 700, fontSize: 24, color: '#1e3a8a', border: '1.5px solid #c7d2fe', borderRadius: 8, maxWidth: 220 }}
              placeholder="Name"
              disabled={loading}
            />
          ) : (
            <h2 className="fw-bold mb-1" style={{ color: '#1e3a8a' }}>{admin.name}</h2>
          )}
          <div className="text-muted mb-2">{admin.email}</div>
        </div>
        <div className="mb-3">
          <label className="fw-bold">Phone</label>
          {editMode ? (
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ border: '1.5px solid #c7d2fe', borderRadius: 8, maxWidth: 220 }}
              placeholder="Phone"
              disabled={loading}
            />
          ) : (
            <div className="mb-2">{admin.phone || <span className="text-muted">Not set</span>}</div>
          )}
        </div>
        <div className="d-flex flex-column gap-2 mt-4">
          {editMode ? (
            <div className="d-flex gap-2">
              <button className="btn btn-primary w-100" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary w-100" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline-primary w-100" onClick={handleEdit}>Edit Profile</button>
              <button className="btn btn-outline-primary w-100 mt-2" onClick={handleResetPassword} disabled>Change Password</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
