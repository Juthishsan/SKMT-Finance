import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsCartFill, BsCurrencyRupee } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ productCount: 0, categoryCount: 0, userCount: 0, orderCount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loanCount, setLoanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentOrders();
    fetchLoanCount();
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

  const columns = [
    {
      name: 'Order Date',
      selector: row => new Date(row.orderDate).toLocaleString(),
      sortable: true,
    },
    {
      name: 'User ID',
      selector: row => row.userId,
    },
    {
      name: 'Total Amount',
      selector: row => `₹${row.grandTotal?.toLocaleString?.() || row.grandTotal}`,
      sortable: true,
    },
    {
      name: 'Payment Method',
      selector: row => row.paymentMethod,
    },
    {
      name: 'Order Status',
      selector: row => row.orderstatus,
    },
  ];

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0, marginBottom: 32 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Admin Dashboard</h2>
            <p className="text-muted" style={{ color: '#e0e7ef', margin: 0, fontWeight: 500 }}>Overview of your platform's key metrics</p>
          </div>
          <div style={{ padding: 32 }}>
            <div className="row g-4 mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              <div className="card shadow-sm text-center p-4" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
                <BsFillArchiveFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Products</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.productCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
                <BsFillGrid3X3GapFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Categories</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.categoryCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
                <BsPeopleFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Users</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.userCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
                <BsCartFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Orders</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.orderCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', color: '#1e3a8a', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
                <BsCurrencyRupee size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold" style={{ color: '#1e3a8a' }}>Loan Applications</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{loanCount}</div>
              </div>
            </div>
            <div className="card shadow-sm p-4" style={{ borderRadius: 18, background: '#e5e7eb', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
              <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: '14px 0 10px 0', margin: '-32px -32px 24px -32px', textAlign: 'center' }}>
                <h4 className="fw-bold mb-0" style={{ color: '#fff' }}>Recent Orders</h4>
              </div>
              <DataTable
                columns={columns}
                data={recentOrders}
                noDataComponent={<div>No recent orders found.</div>}
                highlightOnHover
                pointerOnHover
                striped
                progressPending={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
