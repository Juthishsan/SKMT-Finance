import { useEffect, useState } from 'react';
import { BsEye, BsTrash, BsCheckCircle, BsCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';

const Loans = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewApp, setViewApp] = useState(null);
  const [actionLoading, setActionLoading] = useState('');
  const [deleteAppId, setDeleteAppId] = useState(null);

  const fetchApplications = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/loan-applications');
      if (!res.ok) throw new Error('Failed to fetch loan applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    setActionLoading(id + '-delete');
    try {
      const res = await fetch(`http://localhost:5000/api/loan-applications/${id}`, { method: 'DELETE' });
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
      const res = await fetch(`http://localhost:5000/api/loan-applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error('Failed to mark as processed');
      const updated = await res.json();
      setApplications(apps => apps.map(app => app._id === id ? updated : app));
      Swal.fire({ icon: 'success', title: 'Loan marked as processed!', showConfirmButton: false, timer: 1200 });
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setActionLoading('');
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
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ padding: 10, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, minWidth: 220, maxWidth: 320 }}
                />
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
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Email</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Phone</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Amount</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Loan Type</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Processed</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#dc2626', padding: 32 }}>{error}</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>No applications found.</td></tr>
                  ) : (
                    filtered.map(app => (
                      <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: 12 }}>{app.name}</td>
                        <td style={{ padding: 12 }}>{app.email}</td>
                        <td style={{ padding: 12 }}>{app.phone}</td>
                        <td style={{ padding: 12 }}>₹ {Number(app.amount).toLocaleString()}</td>
                        <td style={{ padding: 12 }}>{app.loanType}</td>
                        <td style={{ padding: 12 }}>
                          {app.processed ? (
                            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><BsCheckCircle size={18} /> Processed</span>
                          ) : (
                            <span style={{ color: '#f59e42', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><BsCircle size={18} /> Pending</span>
                          )}
                        </td>
                        <td style={{ padding: 12, display: 'flex', gap: 12 }}>
                          <button title="View Details" onClick={() => setViewApp(app)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e3a8a' }}><BsEye size={20} /></button>
                          <button title={app.processed ? 'Processed' : 'Mark as Processed'} disabled={app.processed || actionLoading === app._id + '-process'} onClick={() => handleMarkProcessed(app._id)} style={{ background: 'none', border: 'none', cursor: app.processed ? 'not-allowed' : 'pointer', color: app.processed ? '#10b981' : '#64748b' }}><BsCheckCircle size={20} /></button>
                          <button title="Delete" disabled={actionLoading === app._id + '-delete'} onClick={() => setDeleteAppId(app._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><BsTrash size={20} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* View Details Modal */}
      {viewApp && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(30,58,138,0.18)', background: '#fff' }}>
                <div className="modal-body" >
                  <div className='d-flex flex-row justify-content-between pb-3'>
                    <h5 className='animate__animated animate__fadeInDown text-center fw-bold' style={{ color: '#1e3a8a' }}>
                      Loan Application Details
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => setViewApp(null)} style={{ cursor: 'pointer', color: '#ef4444' }}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div style={{ marginBottom: 10 }}><b>Name:</b> {viewApp.name}</div>
                  <div style={{ marginBottom: 10 }}><b>Email:</b> {viewApp.email}</div>
                  <div style={{ marginBottom: 10 }}><b>Phone:</b> {viewApp.phone}</div>
                  <div style={{ marginBottom: 10 }}><b>Loan Type:</b> {viewApp.loanType}</div>
                  <div style={{ marginBottom: 10 }}><b>Amount:</b> ₹ {Number(viewApp.amount).toLocaleString()}</div>
                  <div style={{ marginBottom: 10 }}><b>Message:</b> {viewApp.message || <span style={{ color: '#888' }}>-</span>}</div>
                  <div style={{ marginBottom: 10 }}><b>Status:</b> {viewApp.processed ? 'Processed' : 'Pending'}</div>
                  <div style={{ marginBottom: 10 }}><b>Date:</b> {new Date(viewApp.createdAt).toLocaleString()}</div>
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