import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { BsTrashFill } from 'react-icons/bs';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isOrderedItemsModalOpen, setOrderedItemsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  const ORDER_STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled'];

  const STATUS_COLORS = {
    Pending: '#f59e42',
    Processing: '#2563eb',
    Completed: '#22c55e',
    Cancelled: '#ef4444',
  };

  const API_URL = process.env.REACT_APP_API_URL;

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const openOrderedItemsModal = (rowData) => {
    setSelectedRowData(rowData);
    setOrderedItemsModalOpen(true);
  };

  const generateExcelReport = (startDate, endDate) => {
    if (!startDate || !endDate) {
      Swal.fire('Error', 'Please select both start and end dates.', 'error');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const filteredOrders = tableData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });
    if (filteredOrders.length === 0) {
      Swal.fire('No Orders', 'No orders found in the selected date range.', 'info');
      return;
    }
    const excelData = filteredOrders.map(order => ({
      'Order Date': order.orderDate,
      'Order Status': order.orderstatus,
      'User Name': order.user?.username || '-',
      'User Email': order.user?.email || '-',
      'Product Name': order.product?.name || '-',
      'Product Type': order.product?.type || '-',
      'Product Price': order.product?.price || '-',
      'Model Year': order.product?.modelYear || '-',
      'No. of Owners': order.product?.owners || '-',
      'FC Years': order.product?.fcYears || '-',
      'Insurance': order.product?.insurance ? 'Yes' : 'No',
      'Description': order.product?.description || '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `orders_report_${startDate}_to_${endDate}.xlsx`);
  };

  const handleSearch = (searchQuery) => {
    setSearchText(searchQuery);
    let filteredItems = tableData;
    if (searchQuery) {
      filteredItems = filteredItems.filter((item) =>
        item.orderDate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredData(filteredItems);
  };

  function StatusDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ position: 'relative', minWidth: 160 }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#f1f5f9',
            border: '1.5px solid #c7d2fe',
            borderRadius: 8,
            padding: '6px 20px',
            fontWeight: 700,
            fontSize: 15,
            color: STATUS_COLORS[value] || '#1e3a8a',
            cursor: 'pointer',
            boxShadow: open ? '0 2px 8px #1e3a8a22' : 'none',
            transition: 'box-shadow 0.18s',
            minWidth: 160,
            maxWidth: 220,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: STATUS_COLORS[value] || '#cbd5e1',
            marginRight: 6,
            flexShrink: 0,
          }}></span>
          <span style={{ whiteSpace: 'nowrap', flex: 1 }}>{value}</span>
          <svg style={{ marginLeft: 8, flexShrink: 0 }} width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {open && (
          <div style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            zIndex: 10,
            background: '#fff',
            border: '1.5px solid #c7d2fe',
            borderRadius: 10,
            boxShadow: '0 4px 24px #1e3a8a22',
            minWidth: 160,
            maxWidth: 220,
            padding: 4,
          }}>
            {ORDER_STATUSES.map(status => (
              <div
                key={status}
                onClick={() => { setOpen(false); if (status !== value) onChange(status); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 20px',
                  fontWeight: 600,
                  fontSize: 15,
                  color: STATUS_COLORS[status] || '#1e3a8a',
                  background: status === value ? '#f1f5f9' : '#fff',
                  borderRadius: 8,
                  cursor: status === value ? 'default' : 'pointer',
                  transition: 'background 0.18s',
                  whiteSpace: 'nowrap',
                  minWidth: 160,
                  maxWidth: 220,
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: STATUS_COLORS[status] || '#cbd5e1',
                  marginRight: 6,
                  flexShrink: 0,
                }}></span>
                <span style={{ whiteSpace: 'nowrap', flex: 1 }}>{status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const columns = [
    {
      name: 'Image',
      cell: row => row.product && row.product.images && row.product.images.length > 0 ? (
        <img src={row.product.images[0].startsWith('http') ? row.product.images[0] : `${API_URL}${row.product.images[0]}`} alt="Product" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--border-gray)', background: '#fff' }} />
      ) : (
        <div style={{ color: '#aaa', fontSize: 22 }}>No Image</div>
      ),
      width: '70px',
    },
    {
      name: 'Name',
      selector: row => row.product?.name || '-',
      cell: row => <span style={{ fontWeight: 600 }}>{row.product?.name || '-'}</span>,
    },
    // {
    //   name: 'Model Year',
    //   selector: row => row.product?.modelYear || '-',
    //   cell: row => <span>{row.product?.modelYear || '-'}</span>,
    // },
    {
      name: 'User',
      selector: row => row.user?.username,
      cell: row => <span>{row.user?.username || '-'}</span>,
    },
    {
      name: 'Status',
      selector: row => row.orderstatus,
      cell: row => <span>{row.orderstatus}</span>,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className='d-flex flex-row align-items-center' style={{ gap: 12, flexWrap: 'nowrap', minWidth: 220, marginLeft: -16 }}>
          <i className='bi bi-eye-fill action-btn-view' style={{ color: '#1e3a8a', fontSize: 20, cursor: 'pointer', marginRight: 0 }} onClick={() => openModal(row)} title="View order info"></i>
          <div style={{ flex: '0 0 140px', minWidth: 140, maxWidth: 220 }}>
            <StatusDropdown value={row.orderstatus} onChange={status => handleChangeStatus(row, status)} />
          </div>
        </div>
      ),
      width: '200px',
    },
  ];

  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  };

  const paginatedData = (searchText ? filteredData : tableData).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil((searchText ? filteredData.length : tableData.length) / itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchText]);

  useEffect(() => {
    // Fetch orders data from backend
    fetch(`${API_URL}/api/orders`)
      .then(res => res.json())
      .then(async data => {
        console.log("fetched orders", data);
        // For any order where productSnapshot is just an ID, fetch the full product
        const mapped = await Promise.all(data.map(async order => {
          let product = order.productSnapshot;
          if (typeof product === 'string') {
            // Legacy order, fetch full product
            try {
              const res = await fetch(`${API_URL}/api/products/${product}`);
              if (res.ok) {
                product = await res.json();
              } else {
                product = { name: '-', images: [], type: '-', price: '-', modelYear: '-' };
              }
            } catch {
              product = { name: '-', images: [], type: '-', price: '-', modelYear: '-' };
            }
          }
          return {
            _id: order._id,
            orderDate: new Date(order.orderDate).toLocaleString(),
            orderstatus: order.orderstatus,
            user: order.userSnapshot,
            product,
          };
        }));
        setTableData(mapped);
        setFilteredData(mapped);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
        Swal.fire('Error', 'Failed to fetch orders. Please try again later.', 'error');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isModalOpen && selectedRowData && selectedRowData.uid) {
      // fetchUserDetails(selectedRowData.uid);
    }
  }, [isModalOpen, selectedRowData]);

  // Update the handler to accept the new status
  const handleChangeStatus = async (row, newStatus) => {
    if (newStatus && newStatus !== row.orderstatus) {
      const result = await Swal.fire({
        title: 'Change Order Status?',
        text: `Are you sure you want to change the status to "${newStatus}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e3a8a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      });
      
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/orders/${row._id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });
          const data = await response.json();
          setTableData(prev => prev.map(o => o._id === row._id ? { ...o, orderstatus: newStatus } : o));
          setFilteredData(prev => prev.map(o => o._id === row._id ? { ...o, orderstatus: newStatus } : o));
          setLoading(false);
          setTimeout(() => {
            Swal.fire({ icon: 'success', title: 'Updated!',text:'Order status has been changed!', timer: 1200, showConfirmButton: false });
          }, 1000);
        } catch (error) {
          setLoading(false);
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update order status.',
              timer: 1200, 
              showConfirmButton: 'false'
            });
          }, 1000);
        }
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
    
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setLoading(false);
          setTimeout(() => {
            Swal.fire({ icon: 'success', title: 'Deleted!',text:'Order deleted successfully!', timer: 1200, showConfirmButton: false });
          }, 1000);
          setTableData(prev => prev.filter(o => o._id !== orderId));
          setFilteredData(prev => prev.filter(o => o._id !== orderId));
        } else {
          const errorData = await response.json();
          setLoading(false);
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to delete order',
              text: errorData.error || '',
              showConfirmButton: false,
              confirmButtonColor: 'black',
            });
          }, 1000);
        }
      } catch (error) {
        setLoading(false);
        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            showConfirmButton: true,
            confirmButtonColor: 'black',
          });
        }, 100);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullscreen text="Loading Orders..." />;
  }

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Orders</h2>
          </div>
          <div style={{ padding: 32 }}>
            <div className="row mb-4 align-items-center">
              <div className="col-12">
                <div className="d-flex flex-wrap align-items-center justify-content-between" style={{gap: '18px'}}>
                  <div style={{ minWidth: 250, maxWidth: 300, flex: '1 1 250px', paddingTop: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, boxShadow: '0 2px 8px #1e3a8a11', border: '1.5px solid #c7d2fe', padding: '2px 10px', transition: 'border 0.18s' }}>
                      <span style={{ background: '#2563eb', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                        <i className="bi bi-search" style={{ color: '#fff', fontSize: 18 }}></i>
                      </span>
                      <input
                        type="text"
                        placeholder="Search orders by date"
                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 500, padding: '10px 0', flex: 1, borderRadius: 999, color: '#1e293b' }}
                        value={searchText}
                        onChange={e => handleSearch(e.target.value)}
                        onFocus={e => e.target.parentNode.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.parentNode.style.border = '1.5px solid #c7d2fe'}
                      />
                    </div>
                  </div>
                  {/* Modern Date Filter Card */}
                  <div style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px rgba(30,58,138,0.07)', padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 18, minWidth: 340, maxWidth: 600, flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                      <label style={{ fontWeight: 600, color: '#1e3a8a', fontSize: 15, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="bi bi-calendar-event" style={{ fontSize: 18, color: '#2563eb' }}></i> Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        style={{ border: '1.5px solid #2563eb', background: '#fff', color: '#1e3a8a', padding: '8px 14px', borderRadius: 8, outline: 'none', fontSize: 15, width: 150, fontWeight: 600, boxShadow: '0 1px 4px #2563eb11', transition: 'border 0.18s' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                      <label style={{ fontWeight: 600, color: '#1e3a8a', fontSize: 15, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="bi bi-calendar-event" style={{ fontSize: 18, color: '#2563eb' }}></i> End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        style={{ border: '1.5px solid #2563eb', background: '#fff', color: '#1e3a8a', padding: '8px 14px', borderRadius: 8, outline: 'none', fontSize: 15, width: 150, fontWeight: 600, boxShadow: '0 1px 4px #2563eb11', transition: 'border 0.18s' }}
                      />
                    </div>
                    <button
                      onClick={() => generateExcelReport(startDate, endDate)}
                      style={{ padding: '5px 28px', background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px rgba(30,58,138,0.10)', display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                      <i className="bi bi-download" style={{ fontSize: 20 }}></i> Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="orders-table-responsive table-responsive admins-table-responsive">
              <table className="table table-bordered table-striped" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 0 }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Image</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Name</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>User</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Status</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        {order.product && order.product.images && order.product.images.length > 0 ? (
                          <img src={order.product.images[0].startsWith('http') ? order.product.images[0] : `${API_URL}${order.product.images[0]}`} alt="Product" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--border-gray)', background: '#fff' }} />
                        ) : (
                          <div style={{ color: '#aaa', fontSize: 22 }}>No Image</div>
                        )}
                      </td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{order.product?.name || '-'}</td>
                      <td style={{ padding: 12 }}>{order.user?.username || '-'}</td>
                      <td style={{ padding: 12 }}>
                        <StatusDropdown value={order.orderstatus} onChange={status => handleChangeStatus(order, status)} />
                      </td>
                      <td style={{ padding: 12 }}>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm action-btn-view"
                            style={{ background: 'none', color: '#2563eb', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                            onClick={() => openModal(order)}
                            title="View"
                          >
                            <i className="bi bi-eye-fill" style={{ fontSize: 20 }} />
                          </button>
                          <button
                            className="btn btn-sm action-btn-delete"
                            style={{ background: 'none', color: '#dc2626', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                            onClick={() => handleDeleteOrder(order._id)}
                            title="Delete"
                          >
                            <BsTrashFill size={18} />
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
      {isOrderedItemsModalOpen && selectedRowData && (
        <div>
          <div
            className="modal d-block border-0 orders-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(30,58,138,0.18)', background: '#fff' }}>
                <div className="modal-body">
                  <div className='d-flex flex-row justify-content-between pb-3'>
                    <h5 className='animate__animated animate__fadeInDown text-center fw-bold' style={{ color: '#1e3a8a' }}>
                      Ordered Items
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => setOrderedItemsModalOpen(false)} style={{ cursor: 'pointer', color: '#ef4444' }}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div className='table-responsive'>
                    <table className='table table-bordered'>
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRowData.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.productID}</td>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && selectedRowData && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Order Info</span>
              <button type="button" onClick={() => setModalOpen(false)} className="admin-modal-close-btn" aria-label="Close" title="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div className="admin-modal-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div style={{ flex: '0 0 340px', minWidth: 220, maxWidth: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {selectedRowData.product && selectedRowData.product.images && selectedRowData.product.images.length > 0 ? (
                  <img
                    className="admin-modal-image"
                    src={selectedRowData.product.images[0].startsWith('http') ? selectedRowData.product.images[0] : `${API_URL}${selectedRowData.product.images[0]}`}
                    loading="lazy"
                    alt="Product"
                    style={{ width: '100%', maxWidth: 300, height: 'auto', borderRadius: 18, boxShadow: '0 4px 24px #1e3a8a22', background: '#f1f5f9', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 22, background: '#f1f5f9', borderRadius: 18 }}>No Image</div>
                )}
              </div>
              
              <div className="admin-modal-details" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Vehicle Information</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Product Name</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.product?.name}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Product Type</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.product?.type}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Product Price</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>₹ {selectedRowData.product?.price}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Model Year</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.product?.modelYear}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>No. of Owners</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.product?.owners}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>FC Years</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.product?.fcYears}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Insurance</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.product?.insurance ? 'Yes' : 'No'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Description</div>
                  <div className="admin-modal-value" style={{ fontWeight: 500, fontSize: 16, color: '#222', background: '#f9fafb', borderRadius: 10, padding: 12, marginTop: 2 }}>{selectedRowData.product?.description}</div>
                </div>
                {/* Order Info Section */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #e5e7eb', paddingTop: 15 }}>
                  <div className="admin-modal-label" style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 17, marginBottom: 8, paddingBottom: 18 }}>User Information</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Order Status</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{selectedRowData.orderstatus}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Order Date</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{selectedRowData.orderDate}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>User Name</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{selectedRowData.user?.username}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>User Email</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{selectedRowData.user?.email}</div>
                    </div>
                    <div>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>User Phone</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{selectedRowData.user?.phone}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>User Address</div>
                      <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 16 }}>{selectedRowData.user?.address}, {selectedRowData.user?.city}, {selectedRowData.user?.state} - {selectedRowData.user?.pincode}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders;
