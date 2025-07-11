import { useEffect, useState } from 'react';
import { BsEyeFill, BsTrashFill, BsCheckCircle, BsCircle, BsXCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';

const Loans = () => {
  const { authFetch } = useAuth();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewApp, setViewApp] = useState(null);
  const [actionLoading, setActionLoading] = useState('');
  const [deleteAppId, setDeleteAppId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchApplications = async () => {
    setError('');
    try {
      const res = await authFetch(`${API_URL}/api/loan-applications`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      setError('Failed to fetch loan applications');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [authFetch]);

  const handleDelete = async (id) => {
    setActionLoading(id + '-delete');
    try {
      const res = await authFetch(`${API_URL}/api/loan-applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setApplications(applications => applications.filter(app => app._id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setActionLoading('');
    setDeleteAppId(null);
  };

  const handleMarkProcessed = async (id) => {
    setActionLoading(id + '-process');
    try {
      const res = await authFetch(`${API_URL}/api/loan-applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error('Failed to mark as processed');
      const updated = await res.json();
      setApplications(apps => apps.map(app => app._id === id ? updated : app));
      setActionLoading('');
      setTimeout(() => {
        Swal.fire({ icon: 'success', title: 'Loan marked as processed!', showConfirmButton: false, timer: 1200 });
      }, 1000);
    } catch (err) {
      setActionLoading('');
      setTimeout(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to mark as processed.' });
      }, 1000);
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(id + '-cancel');
    try {
      const res = await authFetch(`${API_URL}/api/loan-applications/${id}/cancel`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Cancel failed');
      const updated = await res.json();
      setApplications(apps => apps.map(app => app._id === id ? updated : app));
      setActionLoading('');
      setTimeout(() => {
        Swal.fire({ icon: 'success', title: 'Loan application cancelled!', showConfirmButton: false, timer: 1200 });
      }, 1000);
    } catch (err) {
      setActionLoading('');
      setTimeout(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to cancel application.' });
      }, 1000);
    }
  };

  // Filter by search and status
  const filtered = applications.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search) ||
      app.loanType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ? true :
      statusFilter === 'Processed' ? app.processed : !app.processed;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  // Export to CSV
  const handleExport = () => {
    const csvRows = [
      ['Name', 'Email', 'Phone', 'Amount', 'Loan Type', 'Message', 'Status', 'Date'],
      ...filtered.map(app => [
        app.name,
        app.email,
        app.phone,
        app.amount,
        app.loanType,
        app.message ? app.message.replace(/\n/g, ' ') : '',
        app.processed ? 'Processed' : 'Pending',
        new Date(app.createdAt).toLocaleString()
      ])
    ];
    const csvContent = csvRows.map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan_applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner fullscreen text="Loading Loans..." />;
  }
  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Loan Applications</h2>
          </div>
          <div style={{ padding: 32 }}>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2 flex-wrap" style={{ flex: 1, minWidth: 260 }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, minWidth: 120, maxWidth: 180 }}>
                  <option value="All">All Statuses</option>
                  <option value="Processed">Processed</option>
                  <option value="Pending">Pending</option>
                </select>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, maxWidth: 320, background: '#fff', borderRadius: 999, boxShadow: '0 2px 8px #1e3a8a11', border: '1.5px solid #c7d2fe', padding: '2px 10px', transition: 'border 0.18s' }}>
                  <span style={{ background: '#2563eb', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                    <i className="bi bi-search" style={{ color: '#fff', fontSize: 18 }}></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 500, padding: '10px 0', flex: 1, borderRadius: 999, color: '#1e293b' }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={e => e.target.parentNode.style.border = '1.5px solid #2563eb'}
                    onBlur={e => e.target.parentNode.style.border = '1.5px solid #c7d2fe'}
                  />
                </div>
              </div>
              <button onClick={handleExport} style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px rgba(30,58,138,0.08)', letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></svg> EXPORT CSV
              </button>
            </div>
            <div className="table-responsive admins-table-responsive">
              <table className="table table-bordered table-striped" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 0 }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Name</th>
                    {/* <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Email</th> */}
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Phone</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Amount</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Loan Type</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Processed</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {error ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#dc2626', padding: 32 }}>{error}</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>No applications found.</td></tr>
                  ) : (
                    paginatedData.map(app => (
                      <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{app.name}</td>
                        {/* <td style={{ padding: 12 }}>{app.email}</td> */}
                        <td style={{ padding: 12 }}>{app.phone}</td>
                        <td style={{ padding: 12 }}>₹ {Number(app.amount).toLocaleString()}</td>
                        <td style={{ padding: 12 }}>{app.loanType}</td>
                        <td style={{ padding: 12 }}>
                          {app.cancelled ? (
                            <span style={{ color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><BsXCircle size={18} /> Cancelled</span>
                          ) : app.processed ? (
                            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><BsCheckCircle size={18} /> Processed</span>
                          ) : (
                            <span style={{ color: '#f59e42', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><BsCircle size={18} /> Pending</span>
                          )}
                        </td>
                        <td style={{ padding: 12 }}>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm action-btn-view"
                              style={{ background: 'none', color: '#2563eb', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                              onClick={() => setViewApp(app)}
                              title="View"
                            >
                              <BsEyeFill size={20} />
                            </button>
                            <button
                              className="btn btn-sm action-btn-edit"
                              style={{ background: 'none', color: app.processed ? '#10b981' : '#64748b', border: 'none', padding: 6, display: 'flex', alignItems: 'center', cursor: app.processed ? 'not-allowed' : 'pointer' }}
                              title={app.processed ? 'Processed' : 'Mark as Processed'}
                              disabled={app.processed || app.cancelled || actionLoading === app._id + '-process'}
                              onClick={() => handleMarkProcessed(app._id)}
                            >
                              <BsCheckCircle size={20} />
                            </button>
                            <button
                              className="btn btn-sm action-btn-cancel"
                              style={{ background: 'none', color: '#dc2626', border: 'none', padding: 6, display: 'flex', alignItems: 'center', cursor: app.cancelled ? 'not-allowed' : 'pointer' }}
                              title={app.cancelled ? 'Cancelled' : 'Cancel Application'}
                              disabled={app.cancelled || actionLoading === app._id + '-cancel'}
                              onClick={() => handleCancel(app._id)}
                            >
                              <BsXCircle size={20} />
                            </button>
                            <button
                              className="btn btn-sm action-btn-delete"
                              style={{ background: 'none', color: '#dc2626', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                              onClick={() => setDeleteAppId(app._id)}
                              title="Delete"
                              disabled={actionLoading === app._id + '-delete'}
                            >
                              <BsTrashFill size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
          </div>
        </div>
      </div>
      {/* View Details Modal */}
      {viewApp && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Loan Application Details</span>
              <button className="admin-modal-close-btn" onClick={() => setViewApp(null)} title="Close" aria-label="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div className="admin-modal-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div className="admin-modal-details" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Applicant Name</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewApp.name}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Email</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewApp.email}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Phone</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewApp.phone}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Loan Type</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewApp.loanType}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Amount</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17, color: '#2563eb' }}>₹ {Number(viewApp.amount).toLocaleString()}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Status</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewApp.processed ? 'Processed' : 'Pending'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Message</div>
                  <div className="admin-modal-value" style={{ fontWeight: 500, fontSize: 16, color: '#222', background: '#f9fafb', borderRadius: 10, padding: 12, marginTop: 2 }}>{viewApp.message || <span style={{ color: '#888' }}>-</span>}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Date</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{new Date(viewApp.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteAppId && (
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
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Delete Application?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to delete this loan application? This action cannot be undone.</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setDeleteAppId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => handleDelete(deleteAppId)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} disabled={actionLoading === deleteAppId + '-delete'}>Delete</button>
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

export default Loans; 