import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const Orders = () => {
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isOrderedItemsModalOpen, setOrderedItemsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const openOrderedItemsModal = (rowData) => {
    setSelectedRowData(rowData);
    setOrderedItemsModalOpen(true);
  };

  const generateExcelReport = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const filteredOrders = tableData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });
    const excelData = filteredOrders.map(order => ({
      'Order Date': order.orderDate,
      'UID': order.uid,
      'Order Status': order.orderstatus,
      'Payment Method': order.paymentMethod,
      'Price': order.total,
      'Grand Total': order.grandTotal
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders_report.xlsx');
  };

  const handleSearch = (searchQuery, selectedType) => {
    let filteredItems = tableData;
    if (searchQuery) {
      filteredItems = filteredItems.filter((item) =>
        item.orderDate.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }
    if (selectedType) {
      filteredItems = filteredItems.filter((item) =>
        item.type.toLowerCase() === selectedType.toLowerCase()
      );
    }
    setFilteredData(filteredItems);
  };

  const columns = [
    {
      name: 'Order Date',
      selector: 'orderDate',
    },
    {
      name: 'Order Status',
      selector: 'orderstatus',
      cell: (row) => (
        <div className='d-flex flex-row py-2'>
          <div className='dropdown dropend'>
            <button
              className='btn btn-secondary dropdown-toggle'
              type='button'
              id='statusDropdown'
              data-bs-toggle='dropdown'
              aria-expanded='false'
              style={{ borderRadius: 8, fontWeight: 600, fontSize: 15 }}
            >
              {row.orderstatus}
            </button>
            <ul className='dropdown-menu' aria-labelledby='statusDropdown'>
              <li className='d-flex'>
                <button className='dropdown-item' onClick={() => handleStatusChange(row.key, 'Processing')}>Processing</button>
              </li>
              <li className='d-flex'>
                <button className='dropdown-item' onClick={() => handleStatusChange(row.key, 'Delivered')}>Delivered</button>
              </li>
              <li className='d-flex'>
                <button className='dropdown-item' onClick={() => handleStatusChange(row.key, 'Shipped')}>Shipped</button>
              </li>
              <li className='d-flex'>
                <button className='dropdown-item' onClick={() => handleStatusChange(row.key, 'Cancelled')}>Cancelled</button>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      name: 'Payment Method',
      selector: 'paymentMethod',
    },
    {
      name: 'Price',
      selector: (row) => `₹ ${row.total}`,
      sortable: true,
    },
    {
      name: 'Grand Total',
      selector: (row) => `₹ ${row.grandTotal}`,
      sortable: true,
    },
    {
      name: 'Ordered Items',
      cell: (row) => (
        <div className='d-flex flex-row'>
          <i className='bi bi-cart-fill action-btn-view px-4' style={{ color: '#1e3a8a', fontSize: 20, cursor: 'pointer' }} onClick={() => openOrderedItemsModal(row)} title="View ordered items"></i>
        </div>
      ),
    },
    {
      name: 'Order Info',
      cell: (row) => (
        <div className='d-flex flex-row'>
          <i className='bi bi-eye-fill action-btn-view px-3' style={{ color: '#1e3a8a', fontSize: 20, cursor: 'pointer' }} onClick={() => openModal(row)} title="View order info"></i>
        </div>
      ),
    },
  ];

  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  };

  const getproducts = () => {
    Swal.fire({
      html: `
        <div className="" >
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      `,
      showConfirmButton: false,
      background: 'transparent',
      timer: 3000
    });
    setTableData(tableData);
    setFilteredData(tableData);
  }

  const updateOrderStatus = (orderKey, newStatus) => {
    // Implementation of updateOrderStatus function
  };

  const handleStatusChange = (orderKey, newStatus) => {
    // Implementation of handleStatusChange function
  };

  const calculatePriceAfterGST = (price) => {
    // Implementation of calculatePriceAfterGST function
  };

  useEffect(() => {
    // Fetch orders data here and setTableData, setFilteredData
  }, []);

  useEffect(() => {
    if (isModalOpen && selectedRowData && selectedRowData.uid) {
      // fetchUserDetails(selectedRowData.uid);
    }
  }, [isModalOpen, selectedRowData]);

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
                  <div style={{ minWidth: 250, maxWidth: 300, flex: '1 1 250px' }}>
                    <div className="input-group">
                      <span className="input-group-text" style={{ background: '#f1f5f9', border: '1.5px solid #c7d2fe' }}><i className="bi bi-search" style={{ color: '#1e3a8a' }}></i></span>
                      <input
                        type="text"
                        placeholder="Search orders by date"
                        className="form-control"
                        style={{ border: '1.5px solid #c7d2fe', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 15, padding: '8px 10px', minWidth: 0 }}
                        value={searchText}
                        onChange={e => {
                          setSearchText(e.target.value);
                          handleSearch(e.target.value, selectedType);
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{gap: '10px', flexWrap: 'wrap'}}>
                    <label style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: 0 }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
                      style={{ border: '1.5px solid #c7d2fe', padding: '6px', borderRadius: '8px', outline: 'none', fontSize: 14, width: 130 }}
            />
                    <label style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: 0 }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
                      style={{ border: '1.5px solid #c7d2fe', padding: '6px', borderRadius: '8px', outline: 'none', fontSize: 14, width: 130 }}
            />
                    <button onClick={() => generateExcelReport(startDate, endDate)} style={{ padding: '7px 16px', background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>Download Report</button>
          </div>
        </div>
              </div>
            </div>
            <div className="orders-table-responsive">
              <DataTable
                className="table table-bordered table-striped "
                columns={columns}
                data={searchText || selectedType ? filteredData : tableData}
                noDataComponent={<div>No orders found.</div>}
                pagination
                paginationComponentOptions={paginationOptions}
                highlightOnHover
                pointerOnHover
                striped
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
                      Order Info
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => setModalOpen(false)} style={{ cursor: 'pointer', color: '#ef4444' }}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div>
                    <div className='container border px-3 rounded-3 orders-modal-inner' style={{ background: '#f9fafb' }}>
                      <div className='row'>
                        <div className='col-md-12 d-flex flex-row justify-content-center pb-3'>
                          <img className='img-fluid' src={selectedRowData.imageURL} width={200} loading='lazy' />
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Product ID</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.key}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>User ID</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.uid}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Order ID</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.key}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Product Price</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.total}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Grand Total</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> ₹ {selectedRowData.grandTotal}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Payment Method</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.paymentMethod}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Order Status</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.orderstatus}</p>
                        </div>
                        <div className='col-md-6 mb-2'>
                          <label className='fw-bold text-primary'>Order Date</label>
                          <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.orderDate}</p>
                        </div>
                        <hr></hr>
                        <div className='container  px-3 orders-modal-inner'>
                          <div className='row '>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>First Name</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.firstName}</p>
                            </div>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>Last Name</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.lastName}</p>
                            </div>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>Address</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.address}</p>
                            </div>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>City</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.city}</p>
                            </div>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>State</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.state}</p>
                            </div>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>Pincode</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.pincode}</p>
                            </div>
                            <div className='col-md-6 mb-2'>
                              <label className='fw-bold text-primary'>Phone</label>
                              <p style={{ color: '#1e3a8a', fontWeight: 600 }}> {selectedRowData.address.phone}</p>
                            </div>
                          </div>
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
  )
}

export default Orders;
