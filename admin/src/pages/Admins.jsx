import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import axios from 'axios';

const Admins = () => {
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [addadmin, setaddadmin] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);

    const openModal = (rowData) => {
        setSelectedRowData(rowData);
        setModalOpen(true);
    };

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/admins');
            setTableData(res.data);
            setFilteredData(res.data);
        } catch (err) {
            setTableData([]);
            setFilteredData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            Swal.fire('Error', 'Name, email, and password are required.', 'error');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/admins', form);
            Swal.fire('Success', 'Admin added successfully!', 'success');
            setForm({ name: '', email: '', phone: '', password: '' });
            setaddadmin(false);
            fetchAdmins();
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
                await axios.delete(`http://localhost:5000/api/admins/${adminId}`);
                Swal.fire('Deleted!', 'Admin has been deleted.', 'success');
                fetchAdmins();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete admin.', 'error');
            }
    }
    };

    const columns = [
        {
            name: '',
            cell: (row) => (
                <i className='bi bi-eye-fill action-btn-view' style={{ color: '#1e3a8a', fontSize: 20, cursor: 'pointer', marginRight: 8 }} onClick={() => openModal(row)} title="View details"></i>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: '',
            cell: (row) => (
                <i className='bi bi-trash-fill action-btn-delete' style={{ color: '#ef4444', fontSize: 20, cursor: 'pointer' }} onClick={() => deleteAdmin(row._id)} title="Delete admin"></i>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            grow: 2,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            grow: 2,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            grow: 3,
        },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Rows per page:',
        rangeSeparatorText: 'of',
    };

    const handleSearch = (searchQuery) => {
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
                                <div className="input-group">
                                    <span className="input-group-text" style={{ background: '#f1f5f9', border: '1.5px solid #c7d2fe' }}><i className="bi bi-search" style={{ color: '#1e3a8a' }}></i></span>
                                    <input
                                        type="text"
                                        placeholder="Search admins by name"
                                        className="form-control"
                                        style={{ border: '1.5px solid #c7d2fe', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 16, padding: '10px 12px' }}
                                        value={searchText}
                                        onChange={e => {
                                            setSearchText(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
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
                            <DataTable
                                className="table table-bordered table-striped "
                                columns={columns}
                                data={searchText ? filteredData : tableData}
                                noDataComponent={<div>No admins found.</div>}
                                pagination
                                paginationComponentOptions={paginationOptions}
                                highlightOnHover
                                pointerOnHover
                                striped
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                progressPending={loading}
                                customStyles={{
                                    headCells: {
                                        style: {
                                            background: '#f1f5f9',
                                            color: '#1e3a8a',
                                            fontWeight: 700,
                                            fontSize: 16,
                                        },
                                    },
                                    rows: {
                                        style: {
                                            fontSize: 15,
                                            borderRadius: 10,
                                            background: '#fff',
                                            transition: 'background 0.2s',
                                        },
                                        highlightOnHoverStyle: {
                                            backgroundColor: '#f4f8ff',
                                            borderBottomColor: '#FFFFFF',
                                            outline: '1px solid #1e3a8a',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && selectedRowData && (
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
                                                Admin Info
                                            </h5>
                                        <h5 className='animate__animated animate__fadeInUp ' onClick={() => setModalOpen(false)} style={{ cursor: 'pointer', color: '#ef4444' }}>
                                                <i className="bi bi-x-circle-fill"></i>
                                            </h5>
                                        </div>
                                        <div>
                                        <div className='container border p-3 rounded-3 admins-modal-inner' style={{ background: '#f9fafb' }}>
                                                <div className='row'>
                                                <div className='col-md-6 mb-2'>
                                                    <label className='fw-bold text-primary'>UID</label>
                                                    <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData._id}</p>
                                                    </div>
                                                <div className='col-md-6 mb-2'>
                                                    <label className='fw-bold text-primary'>Name</label>
                                                    <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.name}</p>
                                                    </div>
                                                <div className='col-md-6 mb-2'>
                                                    <label className='fw-bold text-primary'>Phone</label>
                                                    <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.phone}</p>
                                                    </div>
                                                <div className='col-md-6 mb-2'>
                                                    <label className='fw-bold text-primary'>Email</label>
                                                    <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.email}</p>
                                                </div>
                                            </div>
                                        </div>
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

export default Admins;