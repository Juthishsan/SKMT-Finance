import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsPeopleFill, BsCartFill, BsCurrencyRupee, BsCarFrontFill } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { useAuth } from '../AuthProvider';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard = ({ componentrender }) => {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState({ productCount: 0, categoryCount: 0, userCount: 0, orderCount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loanCount, setLoanCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loanLoading, setLoanLoading] = useState(true);
  const [vehicleSaleCount, setVehicleSaleCount] = useState(0);
  const [userGrowthStats, setUserGrowthStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentOrders();
    fetchRecentLoans();
    fetchLoanCount();
    fetchVehicleSaleCount();
    fetchUserGrowthStats();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/dashboard-stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats({ productCount: 0, categoryCount: 0, userCount: 0, orderCount: 0 });
    }
  };

  const fetchLoanCount = async () => {
    try {
      const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/loan-applications`);
      const data = await res.json();
      setLoanCount(data.length);
    } catch (err) {
      setLoanCount(0);
    }
  };

  const fetchRecentOrders = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/recent-orders`);
      let data = await res.json();
      // For any order where productSnapshot is just an ID, fetch the full product
      data = await Promise.all(data.map(async order => {
        let product = order.productSnapshot;
        if (typeof product === 'string') {
          // Legacy order, fetch full product
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${product}`);
            if (res.ok) {
              product = await res.json();
            } else {
              product = { name: '-' };
            }
          } catch {
            product = { name: '-' };
          }
        }
        return { ...order, productSnapshot: product };
      }));
      setRecentOrders(data);
    } catch (err) {
      setRecentOrders([]);
    }
    setLoading(false);
  };

  const fetchRecentLoans = async () => {
    setLoanLoading(true);
    try {
      const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/loan-applications`);
      const data = await res.json();
      // Get the 10 most recent loan applications
      const recent = data.slice(0, 10);
      setRecentLoans(recent);
    } catch (err) {
      setRecentLoans([]);
    }
    setLoanLoading(false);
  };

  const fetchVehicleSaleCount = async () => {
    try {
      const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/vehicle-sales`);
      const data = await res.json();
      setVehicleSaleCount(data.length);
    } catch (err) {
      setVehicleSaleCount(0);
    }
  };

  const fetchUserGrowthStats = async () => {
    try {
      const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/user-growth-stats`);
      const data = await res.json();
      setUserGrowthStats(data);
    } catch (err) {
      setUserGrowthStats([]);
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'processed' || s === 'approved' || s === 'completed') return { color: '#10b981', bg: '#d1fae5' };
    if (s === 'pending') return { color: '#2563eb', bg: '#e0e7ff' };
    if (s === 'processing') return { color: '#f59e42', bg: '#fef3c7' };
    if (s === 'cancelled' || s === 'rejected') return { color: '#ef4444', bg: '#fee2e2' };
    return { color: '#64748b', bg: '#f1f5f9' };
  };

  const orderColumns = [
    {
      name: 'Order Date',
      selector: row => new Date(row.orderDate).toLocaleString(),
      sortable: true,
    },
    {
      name: 'User Name',
      selector: row => row.userSnapshot?.username || '-',
    },
    {
      name: 'Product Name',
      selector: row => row.productSnapshot?.name || '-',
    },
    {
      name: 'Phone',
      selector: row => row.userSnapshot?.phone || '-',
    },
    {
      name: 'Order Status',
      selector: row => row.orderstatus,
      cell: row => {
        const { color, bg } = getStatusStyle(row.orderstatus);
        return (
          <span style={{
            color,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '6px',
            background: bg,
            fontSize: '14px',
            textTransform: 'capitalize',
          }}>{row.orderstatus}</span>
        );
      },
    },
  ];

  const loanColumns = [
    {
      name: 'Application Date',
      selector: row => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'User Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Loan Type',
      selector: row => row.loanType,
      sortable: true,
    },
    // {
    //   name: 'Email',
    //   selector: row => row.email,
    //   sortable: true,
    // },
    {
      name: 'Phone',
      selector: row => row.phone,
    },
    {
      name: 'Amount',
      selector: row => `₹${row.amount?.toLocaleString?.() || row.amount}`,
      sortable: true,
    },
    {
      name: 'Loan Status',
      selector: row => row.processed ? 'Processed' : (row.status || 'Pending'),
      cell: row => {
        // Use row.status if available, else fallback to processed/pending
        const status = row.processed ? 'Processed' : (row.status || 'Pending');
        const { color, bg } = getStatusStyle(status);
        return (
          <span style={{
            color,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '6px',
            background: bg,
            fontSize: '14px',
            textTransform: 'capitalize',
          }}>{status}</span>
        );
      },
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
                <h5 className="fw-bold">Vehicles</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.productCount}</div>
              </div>
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('VehicleSales')} tabIndex={0} title="Go to Vehicle Sales">
                <BsCarFrontFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Vehicle For Sales</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{vehicleSaleCount}</div>
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
              <div className="card shadow-sm text-center p-4 dashboard-card" style={{ borderRadius: 18, minWidth: 180, flex: '0 0 180px', background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s' }} onClick={() => componentrender('Users')} tabIndex={0} title="Go to Users">
                <BsPeopleFill size={36} className="mb-2" style={{ color: '#1e3a8a' }} />
                <h5 className="fw-bold">Users</h5>
                <div className="fs-2 fw-bold" style={{ color: '#1e3a8a' }}>{stats.userCount}</div>
              </div>
            </div>
            
            {/* Recent Orders Section */}
            <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: 18, background: '#e5e7eb', boxShadow: '0 2px 8px rgba(30,58,138,0.08)' }}>
              <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: '14px 0 10px 0', margin: '-32px -32px 24px -32px', textAlign: 'center' }}>
                <h4 className="fw-bold mb-0" style={{ color: '#fff' }}>Recent Orders</h4>
              </div>
              <DataTable
                columns={orderColumns}
                data={recentOrders.slice(0, 5)}
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
                data={recentLoans.slice(0, 5)}
                noDataComponent={<div>No recent loan applications found.</div>}
                highlightOnHover
                pointerOnHover
                striped
                progressPending={loanLoading}
              />
            </div>
          </div>
        </div>

        {/* Analytics Report Section */}
        <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: 18, background: '#f8fafc', boxShadow: '0 2px 8px rgba(30,58,138,0.10)' }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: '14px 0 10px 0', margin: '-32px -32px 24px -32px', textAlign: 'center', boxShadow: '0 2px 8px #1e3a8a22' }}>
            <h4 className="fw-bold mb-0" style={{ color: '#fff', letterSpacing: 1 }}>Analytics Report</h4>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
            {/* Orders Per Month Bar Chart */}
            <div style={{ flex: '0 0 520px', width: 520, maxWidth: 520, minWidth: 320, height: 480, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #1e3a8a11', padding: 36, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h5 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 24, fontSize: 22 }}>Orders Per Month</h5>
              <div style={{ width: '100%', height: 400 }}>
                <Bar
                  data={getOrdersPerMonthData(recentOrders)}
                  height={400}
                  width={460}
                  options={{
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                      tooltip: { enabled: true },
                    },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 16 } } },
                      y: { grid: { color: '#e0e7ef' }, beginAtZero: true, ticks: { font: { size: 16 } } },
                    },
                  }}
                />
              </div>
            </div>
            {/* Loan Type Distribution Pie Chart */}
            <div style={{ flex: '0 0 520px', width: 520, maxWidth: 520, minWidth: 320, height: 480, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #1e3a8a11', padding: 36, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h5 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 24, fontSize: 22 }}>Loan Type Distribution</h5>
              <div style={{ width: '100%', height: 400 }}>
                <Pie
                  data={getLoanTypeDistributionData(recentLoans)}
                  height={400}
                  width={460}
                  options={{
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { color: '#1e3a8a', font: { weight: 600, size: 16 } } },
                      tooltip: { enabled: true },
                    },
                  }}
                />
              </div>
            </div>
            {/* User Growth Area Chart */}
            <div style={{ flex: '0 0 520px', width: 520, maxWidth: 520, minWidth: 320, height: 480, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #1e3a8a11', padding: 36, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h5 style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 24, fontSize: 22 }}>User Growth</h5>
              <div style={{ width: '100%', height: 400 }}>
                <Line
                  data={getUserGrowthAreaData(userGrowthStats)}
                  height={400}
                  width={460}
                  options={{
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true, backgroundColor: '#1e3a8a', titleColor: '#fff', bodyColor: '#fff', borderColor: '#38bdf8', borderWidth: 2 },
                    },
                    elements: {
                      line: {
                        borderWidth: 4,
                        tension: 0.5,
                        borderColor: '#ef4444', // red
                        fill: true,
                        backgroundColor: (ctx) => {
                          const chart = ctx.chart;
                          const {ctx: canvas, chartArea} = chart;
                          if (!chartArea) return null;
                          const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                          gradient.addColorStop(0, 'rgba(239,68,68,0.35)'); // red
                          gradient.addColorStop(1, 'rgba(239,68,68,0.10)'); // light red
                          return gradient;
                        },
                        shadowColor: 'rgba(56,189,248,0.25)',
                        shadowBlur: 12,
                        shadowOffsetX: 0,
                        shadowOffsetY: 6,
                      },
                      point: {
                        radius: 8,
                        backgroundColor: '#ef4444', // red
                        borderColor: '#fff',
                        borderWidth: 3,
                        hoverRadius: 12,
                        hoverBackgroundColor: '#991b1b', // dark red
                        hoverBorderColor: '#ef4444',
                        hitRadius: 16,
                      },
                    },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 16 }, color: '#1e3a8a' } },
                      y: { grid: { color: '#e0e7ef' }, beginAtZero: true, ticks: { font: { size: 16 }, color: '#1e3a8a' } },
                    },
                    animation: {
                      duration: 1200,
                      easing: 'easeOutQuart',
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Chart data helpers (add at the bottom of the file)
function getOrdersPerMonthData(orders) {
  // Group orders by month (last 6 months)
  const months = [];
  const counts = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    months.push(label);
    counts.push(orders.filter(o => {
      const od = new Date(o.orderDate);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).length);
  }
  return {
    labels: months,
    datasets: [{
      label: 'Orders',
      data: counts,
      backgroundColor: 'linear-gradient(90deg, #3b82f6 60%, #1e3a8a 100%)',
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: '#2563eb',
    }],
  };
}

function getLoanTypeDistributionData(loans) {
  // Count loans by type
  const typeCounts = {};
  loans.forEach(l => {
    const type = l.loanType || 'Other';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const colors = [
    '#3b82f6', '#10b981', '#f59e42', '#ef4444', '#6366f1', '#fbbf24', '#a21caf', '#0ea5e9', '#e11d48', '#84cc16'
  ];
  return {
    labels: Object.keys(typeCounts),
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: colors.slice(0, Object.keys(typeCounts).length),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8,
    }],
  };
}

function getUserGrowthAreaData(userGrowthStats) {
  // Use real user growth stats from backend
  const months = userGrowthStats.map(m => m.month);
  const counts = userGrowthStats.map(m => m.count);
  return {
    labels: months,
    datasets: [{
      label: 'Users',
      data: counts,
      fill: true,
      borderColor: '#ef4444', // red
      backgroundColor: function(context) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(56,189,248,0.35)');
        gradient.addColorStop(1, 'rgba(30,58,138,0.10)');
        return gradient;
      },
      tension: 0.5,
      pointBackgroundColor: '#ef4444', // red
      pointBorderColor: '#fff',
      pointRadius: 8,
      pointHoverRadius: 12,
      pointHoverBackgroundColor: '#991b1b', // dark red
      pointHoverBorderColor: '#ef4444',
      borderWidth: 4,
    }],
  };
}
