import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Account from './pages/Account';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Admins from './pages/Admins';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import ContactMessages from './pages/ContactMessages';
import VehicleSales from './pages/VehicleSales';
import { BsGrid1X2Fill, BsPeopleFill, BsPersonCircle, BsCartFill, BsCurrencyRupee, BsBell, BsCarFrontFill } from 'react-icons/bs';
import { HiMenuAlt3 } from 'react-icons/hi';
import skmtLogo from './assets/skmt logo (1).png';
import Swal from 'sweetalert2';
import { useAuth } from './AuthProvider';

const Engine = ({ component, componentrender }) => {
    const { authFetch, logout } = useAuth();
    // Global loan notification logic
    const [loanNotification, setLoanNotification] = useState('');
    const seenLoanIds = useRef(new Set());
    useEffect(() => {
        const fetchLoanApps = async (showNotification = false) => {
            try {
                const res = await authFetch('http://localhost:5000/api/loan-applications');
                if (!res.ok) return;
                const data = await res.json();
                if (showNotification && seenLoanIds.current.size > 0) {
                    const newApps = data.filter(app => !seenLoanIds.current.has(app._id));
                    if (newApps.length > 0) {
                        setLoanNotification(`${newApps.length} new loan application${newApps.length > 1 ? 's' : ''} received! Click to view.`);
                        setTimeout(() => setLoanNotification(''), 5000);
                    }
                }
                seenLoanIds.current = new Set(data.map(app => app._id));
            } catch {}
        };
        fetchLoanApps();
        const interval = setInterval(() => fetchLoanApps(true), 5000);
        return () => clearInterval(interval);
    }, [authFetch]);

    const render = () => {
        switch (component) {
            case "Products":
                return <Products />;
            case "Orders":
                return <Orders />;
            case "Loans":
                return <Loans />;
            case "Users":
                return <Users />;
            case "Admins":
                return <Admins />;
            case "Profile":
                return <Account />;
            case "ContactMessages":
                return <ContactMessages />;
            case "VehicleSales":
                return <VehicleSales />;
            case "Dashboard":
            default:
                return <Dashboard componentrender={componentrender} />;
        }
    };

    // Find the logout logic from Navbar
    const handleLogout = async () => {
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
          showConfirmButton: false,
          timer: 1200,
        });
        logout();
        componentrender('Login');
        // Close the offcanvas if open
        document.querySelector('#offcanvasDarkNavbar .btn-close')?.click();
    };

    return (
        <div className='container-fluid z' style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', padding: 0 }}>
            {/* Global Loan Notification Banner */}
            {loanNotification && (
                <div
                    style={{ position: 'fixed', top: 24, right: 24, zIndex: 99999, background: '#1e3a8a', color: '#fff', padding: '14px 28px', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,58,138,0.18)', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                    onClick={() => componentrender('Loans')}
                >
                    <BsBell size={22} /> {loanNotification}
                </div>
            )}
            {/* Fixed Sidebar */}
            <div style={{ width: 240, minWidth: 220, maxWidth: 260, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 101, background: '#fff', borderRight: '1.5px solid #e5e7eb', boxShadow: '2px 0 16px rgba(30,58,138,0.06)' }} className='d-none d-lg-block'>
                <Navbar componentrender={componentrender} component={component} />
            </div>
            {/* Main Content Area */}
            <div
                style={{ marginLeft: 240, flex: 1, minWidth: 0 }}
                className='pt-0 pb-0 main-content-area'
            >
                <div className='mt-lg-4 container mt-5 pt-3'>
                    {render()}
                </div>
            </div>
            {/* Mobile Navbar */}
            <div className="d-lg-none d-block" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 1200 }}>
                <div style={{ background: '#fff', border: '4px solid #fff', borderRadius: 24, boxShadow: '0 2px 24px rgba(30,58,138,0.13)', margin: 6, padding: 0 }}>
                    <nav className="navbar text-bg-white" style={{ boxShadow: 'none', minHeight: 60, borderRadius: 24, padding: 0 }}>
                        <div className="container-fluid d-flex align-items-center justify-content-between" style={{ padding: '0 10px' }}>
                            <div>
                                <img src={skmtLogo} width="60" height="60" alt="Logo" style={{ objectFit: 'contain', borderRadius: 16, boxShadow: '0 4px 16px #1e3a8a22', border: '3px solid #fff' }} />
                            </div>
                            <div className='d-flex flex-row justify-content-center'>
                                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation" style={{ border: 'none', background: 'none', fontSize: 32, color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0, height: 60, width: 60, boxShadow: 'none' }}>
                                    <HiMenuAlt3 size={38} />
                                </button>
                            </div>
                            <div className="offcanvas offcanvas-end custom-offcanvas w-75" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel" style={{ borderRadius: 24, border: '4px solid #fff', boxShadow: '0 2px 24px rgba(30,58,138,0.13)' }}>
                                <div className="offcanvas-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <img src={skmtLogo} width="60" height="60" alt="Logo" style={{ objectFit: 'contain', borderRadius: 16, boxShadow: '0 4px 16px #1e3a8a22', border: '3px solid #fff' }} />
                                    <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body p-0" style={{ padding: 0 }}>
                                    <ul className="navbar-nav gap-2 flex-grow-1 pe-3" style={{ padding: 16 }}>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Dashboard' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Dashboard'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsGrid1X2Fill className='icon' /> Dashboard
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Products' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Products'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsGrid1X2Fill className='icon' /> Products
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Orders' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Orders'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsCartFill className='icon' /> Orders
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Loans' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Loans'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsCurrencyRupee className='icon' /> Loans
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Users' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Users'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsPeopleFill className='icon' /> Users
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'VehicleSales' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('VehicleSales'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsCarFrontFill className='icon' /> Vehicle Sales
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Profile' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Profile'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsPersonCircle className='icon' /> Profile
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'Admins' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('Admins'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsPeopleFill className='icon' /> Admins
                                        </li>
                                        <li className={`sidebar-list-item py-3 px-2 ${component === 'ContactMessages' ? 'text-coral' : ''}`} style={{ borderRadius: 10, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.18s' }} onClick={() => { componentrender('ContactMessages'); document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); }}>
                                            <BsBell className='icon' /> Contact Messages
                                        </li>
                                    </ul>
                                    <button
                                      onClick={handleLogout}
                                      style={{
                                        width: '90%',
                                        margin: '24px auto 18px auto',
                                        display: 'block',
                                        background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: '14px 0',
                                        fontWeight: 700,
                                        fontSize: 18,
                                        letterSpacing: 1,
                                        boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s, transform 0.2s',
                                      }}
                                    >
                                      Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Engine;
