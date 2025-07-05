import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthProvider';

const Admins = () => {
    const { authFetch } = useAuth();
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [addadmin, setaddadmin] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const paginatedData = (searchText ? filteredData : tableData).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil((searchText ? filteredData.length : tableData.length) / itemsPerPage);
    useEffect(() => { setCurrentPage(1); }, [searchText]);

    const openModal = (rowData) => {
        setSelectedRowData(rowData);
        setModalOpen(true);
    };

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const res = await authFetch('http://localhost:5000/api/admins');
                const data = await res.json();
                setTableData(data);
                setFilteredData(data);
            } catch (err) {
                setTableData([]);
                setFilteredData([]);
            }
            setLoading(false);
        };
        fetchAdmins();
    }, [authFetch]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            Swal.fire('Error', 'Name, email, and password are required.', 'error');
            return;
        }
        try {
            await authFetch(`http://localhost:5000/api/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            Swal.fire('Success', 'Admin added successfully!', 'success');
            setForm({ name: '', email: '', phone: '', password: '' });
            setaddadmin(false);
            const res = await authFetch('http://localhost:5000/api/admins');
            const data = await res.json();
            setTableData(data);
            setFilteredData(data);
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'Failed to add admin.', 'error');
        }
    };

    const deleteAdmin = async (adminId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the admin.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await authFetch(`http://localhost:5000/api/admins/${adminId}`, { method: 'DELETE' });
                Swal.fire('Deleted!', 'Admin has been deleted.', 'success');
                const res = await authFetch('http://localhost:5000/api/admins');
                const data = await res.json();
                setTableData(data);
                setFilteredData(data);
            } catch (err) {
                Swal.fire('Error', 'Failed to delete admin.', 'error');
            }
        }
    };

    const handleSearch = (searchQuery) => {
        setSearchText(searchQuery);
        let filteredItems = tableData;
        if (searchQuery) {
            filteredItems = filteredItems.filter((item) =>
                item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredData(filteredItems);
    };

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
            <div className="container">
                <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0 }}>
                    <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Admins</h2>
                    </div>
                    <div style={{ padding: 32 }}>
                        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, maxWidth: 320, background: '#fff', borderRadius: 999, boxShadow: '0 2px 8px #1e3a8a11', border: '1.5px solid #c7d2fe', padding: '2px 10px', transition: 'border 0.18s' }}>
                                    <span style={{ background: '#2563eb', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                                        <i className="bi bi-search" style={{ color: '#fff', fontSize: 18 }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search admins by name"
                                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 500, padding: '10px 0', flex: 1, borderRadius: 999, color: '#1e293b' }}
                                        value={searchText}
                                        onChange={e => handleSearch(e.target.value)}
                                        onFocus={e => e.target.parentNode.style.border = '1.5px solid #2563eb'}
                                        onBlur={e => e.target.parentNode.style.border = '1.5px solid #c7d2fe'}
                                    />
                                </div>
                            </div>
                            <button
                              style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(30,58,138,0.08)', border: 'none', padding: '10px 28px', letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                              onClick={() => setaddadmin(!addadmin)}
                            >
                              {addadmin ? 'Close' : 'Add Admin'}
                            </button>
                        </div>
                        {addadmin && (
                            <div className='mb-4'>
                                <form onSubmit={handleAddAdmin} className='border p-4 rounded-3' style={{ background: '#f9fafb', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
                                    <div className='row g-3'>
                                        <div className='col-md-3'>
                                            <input type='text' className='form-control' placeholder='Name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15 }} />
                                        </div>
                                        <div className='col-md-3'>
                                            <input type='email' className='form-control' placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15 }} />
                                        </div>
                                        <div className='col-md-3'>
                                            <input type='text' className='form-control' placeholder='Phone' value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15 }} />
                                        </div>
                                        <div className='col-md-3'>
                                            <input type='password' className='form-control' placeholder='Password' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15 }} />
                                        </div>
                                        <div className='col-md-12 text-end'>
                                            <button type='submit' className='btn btn-primary' style={{ borderRadius: 8, fontWeight: 600, fontSize: 16 }}>Add Admin</button>
                                            <button type='button' className='btn btn-secondary ms-2' style={{ borderRadius: 8, fontWeight: 600, fontSize: 16 }} onClick={() => setaddadmin(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        <div className='table-responsive admins-table-responsive'>
                          <table className="table table-bordered table-striped" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 0 }}>
                            <thead style={{ background: '#f1f5f9' }}>
                              <tr>
                                <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Name</th>
                                <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Phone</th>
                                <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Email</th>
                                <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedData.map(admin => (
                                <tr key={admin._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: 12, fontWeight: 600 }}>{admin.name}</td>
                                  <td style={{ padding: 12 }}>{admin.phone || '-'}</td>
                                  <td style={{ padding: 12 }}>{admin.email}</td>
                                  <td style={{ padding: 12 }}>
                                    <div className="d-flex gap-2">
                                      <button
                                        className="btn btn-sm action-btn-view"
                                        style={{ background: 'none', color: '#2563eb', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                                        onClick={() => openModal(admin)}
                                        title="View"
                                      >
                                        <i className="bi bi-eye-fill" style={{ fontSize: 20 }}></i>
                                      </button>
                                      <button
                                        className="btn btn-sm action-btn-delete"
                                        style={{ background: 'none', color: '#ef4444', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                                        onClick={() => deleteAdmin(admin._id)}
                                        title="Delete"
                                      >
                                        <i className="bi bi-trash-fill" style={{ fontSize: 18 }}></i>
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
                    </div>
                </div>
            </div>
            {isModalOpen && selectedRowData && (
                <div className="admin-modal-bg">
                  <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
                    <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
                      <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Admin Info</span>
                      <button className="admin-modal-close-btn" onClick={() => setModalOpen(false)} title="Close" aria-label="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                        ×
                      </button>
                    </div>
                    <div className="admin-modal-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                      <div className="admin-modal-details" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>UID</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData._id}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Name</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.name}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Phone</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.phone || '-'}</div>
                        </div>
                        <div>
                          <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Email</div>
                          <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17, color: '#2563eb' }}>{selectedRowData.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
        </div>
    );
};

export default Admins;