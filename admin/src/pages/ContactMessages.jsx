import { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';

const ContactMessages = () => {
  const { authFetch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMsg, setViewMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await authFetch('http://localhost:5000/api/contact-messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError('Failed to fetch contact messages');
      }
      setLoading(false);
    };
    fetchMessages();
  }, [authFetch]);

  const filtered = messages.filter(msg =>
    msg.name.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase()) ||
    msg.phone.includes(search) ||
    (msg.service || '').toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [search]);

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Contact Form Messages</h2>
          </div>
          <div style={{ padding: 32 }}>
            <div className="row mb-4 align-items-center">
              <div className="col-md-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, maxWidth: 320, background: '#fff', borderRadius: 999, boxShadow: '0 2px 8px #1e3a8a11', border: '1.5px solid #c7d2fe', padding: '2px 10px', transition: 'border 0.18s' }}>
                  <span style={{ background: '#2563eb', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                    <i className="bi bi-search" style={{ color: '#fff', fontSize: 18 }}></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or service..."
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 500, padding: '10px 0', flex: 1, borderRadius: 999, color: '#1e293b' }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={e => e.target.parentNode.style.border = '1.5px solid #2563eb'}
                    onBlur={e => e.target.parentNode.style.border = '1.5px solid #c7d2fe'}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive admins-table-responsive">
              <table className="table table-bordered table-striped" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 0 }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Name</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Email</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Message</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32 }}>Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#dc2626', padding: 32 }}>{error}</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32 }}>No messages found.</td></tr>
                  ) : (
                    paginatedData.map(msg => (
                      <tr key={msg._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: 12,fontWeight: 600 }}>{msg.name}</td>
                        <td style={{ padding: 12 }}>{msg.email}</td>
                        <td style={{ padding: 12, maxWidth: 180, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{msg.message?.slice(0, 40) || '-'}{msg.message && msg.message.length > 40 ? '...' : ''}</td>
                        <td style={{ padding: 12 }}>
                          <i className='bi bi-eye-fill action-btn-view' style={{ color: '#1e3a8a', fontSize: 20, cursor: 'pointer', marginRight: 8 }} onClick={() => setViewMsg(msg)} title="View details"></i>
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
      {viewMsg && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Contact Message Details</span>
              <button className="admin-modal-close-btn" onClick={() => setViewMsg(null)} title="Close" aria-label="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div className="admin-modal-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div className="admin-modal-details" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Name</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewMsg.name}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Email</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewMsg.email}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Phone</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewMsg.phone}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Service</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{viewMsg.service || '-'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Message</div>
                  <div className="admin-modal-value" style={{ fontWeight: 500, fontSize: 16, color: '#222', background: '#f9fafb', borderRadius: 10, padding: 12, marginTop: 2 }}>{viewMsg.message || <span style={{ color: '#888' }}>-</span>}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Date</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{new Date(viewMsg.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages; 