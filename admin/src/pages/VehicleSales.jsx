import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCheckCircle, BsXCircle, BsTrash, BsSearch, BsEyeFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../AuthProvider';

const API_URL = process.env.REACT_APP_API_URL;

const VehicleSales = () => {
  const { authFetch } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // <-- Add this line
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [approveId, setApproveId] = useState(null);
  const [rejectId, setRejectId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = vehicles;
    if (searchText) {
      filtered = filtered.filter(
        v =>
          v.brand?.toLowerCase().includes(searchText.toLowerCase()) ||
          v.title?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        v => (v.status || 'pending').toLowerCase() === statusFilter.toLowerCase()
      );
    }
    setFilteredVehicles(filtered);
  }, [searchText, vehicles, statusFilter]);

  useEffect(() => { setCurrentPage(1); }, [searchText, statusFilter]);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API_URL}/api/vehicle-sales`);
      const data = await res.json();
      // Sort by createdAt descending (most recent first)
      let sortedVehicles = Array.isArray(data.data) ? data.data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      // For any vehicle where user is a string (user ID), fetch user details
      sortedVehicles = await Promise.all(sortedVehicles.map(async v => {
        if (v.user && typeof v.user === 'string') {
          try {
            const userRes = await authFetch(`${API_URL}/api/users/${v.user}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData.data) {
                v.user = {
                  username: userData.data.username || 'Not provided',
                  email: userData.data.email || 'Not provided',
                  phone: userData.data.phone || 'Not provided',
                  address: userData.data.address || 'Not provided',
                  city: userData.data.city || '',
                  state: userData.data.state || '',
                  pincode: userData.data.pincode || '',
                  createdAt: userData.data.createdAt || '',
                  _id: userData.data._id || '',
                };
              } else {
                v.user = { username: 'Not provided', email: 'Not provided', phone: 'Not provided', address: 'Not provided', city: '', state: '', pincode: '', createdAt: '', _id: '' };
              }
            }
          } catch {}
        }
        return v;
      }));
      setVehicles(sortedVehicles);
    } catch (err) {
      setError('Failed to fetch vehicle sales.');
    }
    setLoading(false);
  };

  const handleApprove = (id) => {
    setApproveId(id);
  };
  const confirmApprove = async () => {
    setLoading(true);
    try {
      await authFetch(`${API_URL}/api/vehicle-sales/${approveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<span style="color:#16a34a;font-weight:700;font-size:22px;">Vehicle Sale Approved!</span>',
          html: '<div style="color:#444;font-size:16px;margin-top:8px;">The vehicle sale was approved.</div>',
          background: '#f0fdfa',
          showConfirmButton: false,
          timer: 1400,
          customClass: { popup: 'swal2-animate-success' }
        });
      }, 400);
      fetchVehicles();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to approve vehicle sale.' });
      }, 100);
    }
    setApproveId(null);
  };
  const handleReject = (id) => {
    setRejectId(id);
  };
  const confirmReject = async () => {
    setLoading(true);
    try {
      await authFetch(`${API_URL}/api/vehicle-sales/${rejectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<span style="color:#16a34a;font-weight:700;font-size:22px;">Vehicle Sale Rejected!</span>',
          html: '<div style="color:#444;font-size:16px;margin-top:8px;">The vehicle sale was rejected.</div>',
          background: '#f0fdfa',
          showConfirmButton: false,
          timer: 1400,
          customClass: { popup: 'swal2-animate-success' }
        });
      }, 400);
      fetchVehicles();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to reject vehicle sale.' });
      }, 100);
    }
    setRejectId(null);
  };
  const handleDelete = (id) => {
    setDeleteVehicleId(id);
  };
  const confirmDeleteVehicle = async () => {
    setLoading(true);
    try {
      await authFetch(`${API_URL}/api/vehicle-sales/${deleteVehicleId}`, { method: 'DELETE' });
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<span style="color:#16a34a;font-weight:700;font-size:22px;">Vehicle Sale Deleted!</span>',
          html: '<div style="color:#444;font-size:16px;margin-top:8px;">The vehicle sale was successfully deleted.</div>',
          background: '#f0fdfa',
          showConfirmButton: false,
          timer: 1400,
          customClass: { popup: 'swal2-animate-success' }
        });
      }, 400);
      fetchVehicles();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete vehicle sale.' });
      }, 100);
    }
    setDeleteVehicleId(null);
  };

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSlideshowIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
    setSlideshowIndex(0);
  };

  if (loading) {
    return <LoadingSpinner fullscreen text="Loading Vehicle Sales..." />;
  }
  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0, marginBottom: 32 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Vehicles For Sales</h2>
          </div>
          <div style={{ padding: 32 }}>
            <div className="d-flex align-items-center mb-4 flex-wrap gap-3" style={{ justifyContent: 'flex-start' }}>
              {/* Status Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  border: '1.5px solid #c7d2fe',
                  borderRadius: 8,
                  fontSize: 15,
                  minWidth: 120,
                  maxWidth: 180,
                  padding: '8px 12px',
                  background: '#fff',
                  color: '#1e3a8a',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Search Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, maxWidth: 320, background: '#fff', borderRadius: 999, boxShadow: '0 2px 8px #1e3a8a11', border: '1.5px solid #c7d2fe', padding: '2px 10px', transition: 'border 0.18s' }}>
                <span style={{ background: '#2563eb', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                  <i className="bi bi-search" style={{ color: '#fff', fontSize: 18 }}></i>
                </span>
                <input
                  type="text"
                  placeholder="Search by brand or title"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 500, padding: '10px 0', flex: 1, borderRadius: 999, color: '#1e293b' }}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onFocus={e => e.target.parentNode.style.border = '1.5px solid #2563eb'}
                  onBlur={e => e.target.parentNode.style.border = '1.5px solid #c7d2fe'}
                />
              </div>
            </div>
            {error && <div style={{ color: '#dc2626', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
            {filteredVehicles.length === 0 ? (
              <div>No vehicle sales found.</div>
            ) : (
              <div className="table-responsive admins-table-responsive">
                <table className="table table-bordered table-striped" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 0 }}>
                  <thead style={{ background: '#f1f5f9' }}>
                    <tr>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Image</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Brand</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Year</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Price</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>User</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Status</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>FC</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Insurance</th>
                      <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(vehicle => (
                      <tr key={vehicle._id} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          {(vehicle.images && vehicle.images.length > 0) ? (
                            <img src={vehicle.images[0]} alt={vehicle.title} style={{ width: 48, height: 48, objectFit: 'cover' }} />
                          ) : (
                            <div style={{ color: '#aaa', fontSize: 22 }}>No Image</div>
                          )}
                        </td>
                        <td style={{ padding: 12, fontWeight: 600 }}>{vehicle.brand}</td>
                        <td style={{ padding: 12 }}>{vehicle.year}</td>
                        <td style={{ padding: 12, fontWeight: 700 }}>₹{vehicle.price?.toLocaleString?.() || vehicle.price}</td>
                        <td style={{ padding: 12 }}>
                          {vehicle.user && typeof vehicle.user === 'object'
                            ? (vehicle.user.username || vehicle.user.email || vehicle.user._id || '-')
                            : '-'}
                        </td>
                        <td style={{ fontWeight: 600, color: vehicle.status === 'approved' ? '#10b981' : vehicle.status === 'rejected' ? '#dc2626' : '#1e3a8a', padding: 12 }}>
                          {vehicle.status || 'pending'}
                        </td>
                        <td style={{ padding: 12 }}>
                          {vehicle.fc === 'Yes' ? `Yes (${vehicle.fcDuration || '-'} ${vehicle.fcUnit || ''})` : 'No'}
                        </td>
                        <td style={{ padding: 12 }}>
                          {vehicle.insurance === 'Yes' ? `Yes (${vehicle.insuranceDuration || '-'} ${vehicle.insuranceUnit || ''})` : 'No'}
                        </td>
                        <td style={{ padding: 12 }}>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm action-btn-view"
                              style={{ background: 'none', color: '#2563eb', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                              onClick={() => openModal(vehicle)}
                              title="View Details"
                            >
                              <BsEyeFill size={20} />
                            </button>
                            <button
                              className="btn btn-sm action-btn-view"
                              style={{ background: 'none', color: '#10b981', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                              onClick={() => handleApprove(vehicle._id)}
                              title="Approve"
                            >
                              <BsCheckCircle size={20} />
                            </button>
                            <button
                              className="btn btn-sm action-btn-edit"
                              style={{ background: 'none', color: '#dc2626', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                              onClick={() => handleReject(vehicle._id)}
                              title="Reject"
                            >
                              <BsXCircle size={18} />
                            </button>
                            <button
                              className="btn btn-sm action-btn-delete"
                              style={{ background: 'none', color: '#6b7280', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                              onClick={() => handleDelete(vehicle._id)}
                              title="Delete"
                            >
                              <BsTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ border: 'none', background: currentPage === 1 ? '#e5e7eb' : '#2563eb', color: '#fff', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 16, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #1e3a8a11', transition: 'background 0.18s' }}>Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) ? (
                        <button key={page} onClick={() => setCurrentPage(page)} style={{ border: 'none', background: page === currentPage ? 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)' : '#fff', color: page === currentPage ? '#fff' : '#2563eb', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 16, boxShadow: page === currentPage ? '0 2px 8px #1e3a8a22' : '0 2px 8px #1e3a8a11', margin: '0 2px', cursor: 'pointer', borderBottom: page === currentPage ? '2.5px solid #2563eb' : '2.5px solid transparent', transition: 'all 0.18s' }}>{page}</button>
                      ) : (
                        (page === currentPage - 2 || page === currentPage + 2) && totalPages > 5 ? <span key={page} style={{ color: '#64748b', fontWeight: 700, fontSize: 18, margin: '0 4px' }}>...</span> : null
                      )
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ border: 'none', background: currentPage === totalPages ? '#e5e7eb' : '#2563eb', color: '#fff', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 16, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #1e3a8a11', transition: 'background 0.18s' }}>Next</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal for vehicle details */}
      {modalOpen && selectedVehicle && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Vehicle Details</span>
              <button className="admin-modal-close-btn" onClick={closeModal} title="Close" aria-label="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div className="admin-modal-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div style={{ flex: '0 0 340px', minWidth: 220, maxWidth: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {(selectedVehicle.images || []).length > 0 ? (
                  <>
                    <img
                      className="admin-modal-image"
                      src={selectedVehicle.images[slideshowIndex]}
                      loading="lazy"
                      alt={selectedVehicle.title}
                      style={{ width: '100%', maxWidth: 300, height: 'auto', borderRadius: 18, boxShadow: '0 4px 24px #1e3a8a22', background: '#f1f5f9', objectFit: 'cover' }}
                    />
                    {selectedVehicle.images.length > 1 && (
                      <>
                        <button
                          className="slideshow-arrow left"
                          style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,58,138,0.10)', transition: 'background 0.18s, color 0.18s', opacity: 0.95, outline: 'none' }}
                          onClick={() => setSlideshowIndex(prev => prev === 0 ? selectedVehicle.images.length - 1 : prev - 1)}
                          aria-label="Previous image"
                          onMouseOver={e => e.currentTarget.style.background='#1e3a8a'}
                          onMouseOut={e => e.currentTarget.style.background='#2563eb'}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 13L5.5 8L10.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button
                          className="slideshow-arrow right"
                          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,58,138,0.10)', transition: 'background 0.18s, color 0.18s', opacity: 0.95, outline: 'none' }}
                          onClick={() => setSlideshowIndex(prev => prev === selectedVehicle.images.length - 1 ? 0 : prev + 1)}
                          aria-label="Next image"
                          onMouseOver={e => e.currentTarget.style.background='#1e3a8a'}
                          onMouseOut={e => e.currentTarget.style.background='#2563eb'}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 13L10.5 8L5.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </>
                    )}
                    <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                      {selectedVehicle.images.map((_, idx) => (
                        <span key={idx} style={{ width: 8, height: 8, borderRadius: '50%', background: slideshowIndex === idx ? '#2563eb' : '#cbd5e1', display: 'inline-block', transition: 'background 0.18s', cursor: 'pointer' }} onClick={() => setSlideshowIndex(idx)}></span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 22, background: '#f1f5f9', borderRadius: 18 }}>No Image</div>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Vehicle Details Section */}
                <div>
                  <h4 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 16, fontSize: 20 }}>Vehicle Information</h4>
                  <div className="admin-modal-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Brand</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.brand}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Year</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.year}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Fuel</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.fuel}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Transmission</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.transmission}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>KM Driven</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.kmDriven}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Owners</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.owners}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Title</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.title}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Price</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>₹{selectedVehicle.price?.toLocaleString?.() || selectedVehicle.price}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Status</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17, color: selectedVehicle.status === 'approved' ? '#10b981' : selectedVehicle.status === 'rejected' ? '#dc2626' : '#1e3a8a' }}>{selectedVehicle.status || 'pending'}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>FC</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>
                        {selectedVehicle.fc === 'Yes'
                          ? `Yes (${selectedVehicle.fcDuration || '-'} ${selectedVehicle.fcUnit || ''})`
                          : 'No'}
                      </div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Insurance</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>
                        {selectedVehicle.insurance === 'Yes'
                          ? `Yes (${selectedVehicle.insuranceDuration || '-'} ${selectedVehicle.insuranceUnit || ''})`
                          : 'No'}
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Description</div>
                      <div className="admin-modal-value" style={{ fontWeight: 500, fontSize: 16, color: '#222', background: '#f9fafb', borderRadius: 10, padding: 12, marginTop: 2 }}>{selectedVehicle.description}</div>
                    </div>
                  </div>
                </div>

                {/* User Details Section */}
                {selectedVehicle.user && (
                  <div>
                    <h4 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 16, fontSize: 20 }}>Seller Information</h4>
                    <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Full Name</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.user.username || 'Not provided'}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Email</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.user.email || 'Not provided'}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Phone</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.user.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>User ID</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17, color: '#6b7280' }}>{selectedVehicle.user._id}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Address</div>
                          <div className="admin-modal-value" style={{ fontWeight: 500, fontSize: 16, color: '#222', background: '#fff', borderRadius: 10, padding: 12, marginTop: 2, border: '1px solid #e2e8f0' }}>
                            {selectedVehicle.user.address ? (
                              <>
                                <div>{selectedVehicle.user.address}</div>
                                {selectedVehicle.user.city && <div>{selectedVehicle.user.city}</div>}
                                {selectedVehicle.user.state && <div>{selectedVehicle.user.state}</div>}
                                {selectedVehicle.user.pincode && <div>PIN: {selectedVehicle.user.pincode}</div>}
                              </>
                            ) : 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Registration Date</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedVehicle.user.createdAt ? new Date(selectedVehicle.user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not available'}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Account Status</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17, color: '#10b981' }}>
                            Active
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Approve Confirmation Modal */}
      {approveId && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(16,196,34,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#16a34a', marginBottom: 12 }}>✔️</div>
                  <h3 style={{ color: '#16a34a', marginBottom: 10 }}>Approve Vehicle Sale?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to approve this vehicle sale?</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setApproveId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmApprove} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #16a34a 60%, #4ade80 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Approve</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reject Confirmation Modal */}
      {rejectId && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#dc2626', marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Reject Vehicle Sale?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to reject this vehicle sale?</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setRejectId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmReject} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteVehicleId && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#dc2626', marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Delete Vehicle Sale?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to delete this vehicle sale? This action cannot be undone.</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setDeleteVehicleId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmDeleteVehicle} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSales;