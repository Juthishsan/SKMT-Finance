import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsPeopleFill, BsCartFill, BsCurrencyRupee, BsCarFrontFill } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const Dashboard = ({ componentrender }) => {
  const [stats, setStats] = useState({ productCount: 0, categoryCount: 0, userCount: 0, orderCount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loanCount, setLoanCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loanLoading, setLoanLoading] = useState(true);
  const [vehicleSaleCount, setVehicleSaleCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentOrders();
    fetchRecentLoans();
    fetchLoanCount();
    fetchVehicleSaleCount();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      setStats({ productCount: 0, categoryCount: 0, userCount: 0, orderCount: 0 });
    }
  };

  const fetchLoanCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/loan-applications');
      setLoanCount(res.data.length);
    } catch (err) {
      setLoanCount(0);
    }
  };

  const fetchRecentOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/recent-orders');
      setRecentOrders(res.data);
    } catch (err) {
      setRecentOrders([]);
    }
    setLoading(false);
  };

  const fetchRecentLoans = async () => {
    setLoanLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/loan-applications');
      // Get the 10 most recent loan applications
      const recent = res.data.slice(0, 10);
      setRecentLoans(recent);
    } catch (err) {
      setRecentLoans([]);
    }
    setLoanLoading(false);
  };

  const fetchVehicleSaleCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vehicle-sales');
      setVehicleSaleCount(res.data.length);
    } catch (err) {
      setVehicleSaleCount(0);
    }
  };

  const orderColumns = [
    {
      name: 'Order Date',
      selector: row => new Date(row.orderDate).toLocaleString(),
      sortable: true,
    },
    {
      name: 'User',
      selector: row => row.userSnapshot?.username || '-',
    },
    // {
    //   name: 'Product',
    //   selector: row => row.productSnapshot?.name || '-',
    // },
    // {
    //   name: 'Price',
    //   selector: row => row.productSnapshot?.price ? `₹${row.productSnapshot.price}` : '-',
    // },
    {
      name: 'Order Status',
      selector: row => row.orderstatus,
    },
  ];

  const loanColumns = [
    {
      name: 'Application Date',
      selector: row => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
    },
    {
      name: 'Loan Type',
      selector: row => row.loanType,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: row => `₹${row.amount?.toLocaleString?.() || row.amount}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.processed ? 'Processed' : 'Pending',
      cell: row => (
        <span style={{ 
          color: row.processed ? '#10b981' : '#1e3a8a', 
          fontWeight: 600,
          padding: '4px 8px',
          borderRadius: '6px',
          background: row.processed ? '#d1fae5' : '#dbeafe',
          fontSize: '14px'
        }}>
          {row.processed ? 'Processed' : 'Pending'}
        </span>
      ),
    },
  ];

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0, marginBottom: 32 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Admin Dashboard</h2>
            {/* <p className="text-muted" style={{ color: '#e0e7ef', margin: 0, fontWeight: 500 }}>Overview of your platform's key metrics</p> */}
          </div>
          <div style={{ padding: 32 }}>
            <div className="row g-4 mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('Products')} tabIndex={0} title="Go to Products">
                <BsFillArchiveFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Products</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.productCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('VehicleSales')} tabIndex={0} title="Go to Vehicle Sales">
                <BsCarFrontFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Vehicle Sales</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{vehicleSaleCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('Users')} tabIndex={0} title="Go to Users">
                <BsPeopleFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Users</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.userCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('Orders')} tabIndex={0} title="Go to Orders">
                <BsCartFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Orders</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.orderCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', color: '#1e3a8a', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('Loans')} tabIndex={0} title="Go to Loans">
                <BsCurrencyRupee size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold" style={{ color: '#1e3a8a' }}>Loan Applications</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{loanCount}</div>
              </div>
            </div>
            
            {/* Recent Orders Section */}
            <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: 18, background: '#e5e7eb', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
              <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: '14px 0 10px 0', margin: '-32px -32px 24px -32px', textAlign: 'center' }}>
                <h4 className="fw-bold mb-0" style={{ color: '#fff' }}>Recent Orders</h4>
              </div>
              <DataTable
                columns={orderColumns}
                data={recentOrders}
                noDataComponent={<div>No recent orders found.</div>}
                highlightOnHover
                pointerOnHover
                striped
                progressPending={loading}
              />
            </div>

            {/* Recent Loan Applications Section */}
            <div className="card shadow-sm p-4" style={{ borderRadius: 18, background: '#e5e7eb', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
              <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: '14px 0 10px 0', margin: '-32px -32px 24px -32px', textAlign: 'center' }}>
                <h4 className="fw-bold mb-0" style={{ color: '#fff' }}>Recent Loan Applications</h4>
              </div>
              <DataTable
                columns={loanColumns}
                data={recentLoans}
                noDataComponent={<div>No recent loan applications found.</div>}
                highlightOnHover
                pointerOnHover
                striped
                progressPending={loanLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
