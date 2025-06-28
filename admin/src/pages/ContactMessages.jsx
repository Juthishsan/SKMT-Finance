import { useEffect, useState } from 'react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMsg, setViewMsg] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/contact-messages');
        if (!res.ok) throw new Error('Failed to fetch contact messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const filtered = messages.filter(msg =>
    msg.name.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase()) ||
    msg.phone.includes(search) ||
    (msg.service || '').toLowerCase().includes(search.toLowerCase())
  );

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
                <div className="input-group">
                  <span className="input-group-text" style={{ background: '#f1f5f9', border: '1.5px solid #c7d2fe' }}><i className="bi bi-search" style={{ color: '#1e3a8a' }}></i></span>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or service..."
                    className="form-control"
                    style={{ border: '1.5px solid #c7d2fe', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 16, padding: '10px 12px' }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
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
                    filtered.map(msg => (
                      <tr key={msg._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: 12 }}>{msg.name}</td>
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
            </div>
          </div>
        </div>
      </div>
      {/* View Details Modal */}
      {viewMsg && (
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
                      Contact Message Details
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => setViewMsg(null)} style={{ cursor: 'pointer', color: '#ef4444' }}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div style={{ marginBottom: 10 }}><b>Name:</b> {viewMsg.name}</div>
                  <div style={{ marginBottom: 10 }}><b>Email:</b> {viewMsg.email}</div>
                  <div style={{ marginBottom: 10 }}><b>Phone:</b> {viewMsg.phone}</div>
                  <div style={{ marginBottom: 10 }}><b>Service:</b> {viewMsg.service || '-'}</div>
                  <div style={{ marginBottom: 10 }}><b>Message:</b> {viewMsg.message || <span style={{ color: '#888' }}>-</span>}</div>
                  <div style={{ marginBottom: 10 }}><b>Date:</b> {new Date(viewMsg.createdAt).toLocaleString()}</div>
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