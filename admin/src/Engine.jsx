import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Account from './pages/Account';
import ScrollToTop from './ScrollToTop';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Admins from './pages/Admins';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import ContactMessages from './pages/ContactMessages';
import {
BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsPersonCircle, BsCartFill, BsCurrencyRupee, BsBell
}
    from 'react-icons/bs'

const Engine = ({ component, componentrender }) => {
    // Global loan notification logic
    const [loanNotification, setLoanNotification] = useState('');
    const seenLoanIds = useRef(new Set());
    useEffect(() => {
        const fetchLoanApps = async (showNotification = false) => {
            try {
                const res = await fetch('http://localhost:5000/api/loan-applications');
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
    }, []);

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
            case "Dashboard":
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className='container-fluid z'>
            {/* Global Loan Notification Banner */}
            {loanNotification && (
                <div
                    style={{ position: 'fixed', top: 24, right: 24, zIndex: 99999, background: '#1e3a8a', color: '#fff', padding: '14px 28px', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,58,138,0.18)', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                    onClick={() => componentrender('Loans')}
                >
                    <BsBell size={22} /> {loanNotification}
                </div>
            )}
            <div className='row'>
                <div className='col-12 col-lg-2 d-lg-block d-none'>
                    <div>
                        <Navbar componentrender={componentrender} component={component} />
                    </div>
                </div>
                <div className='col-12 col-lg-10'>
                    <div className='mt-lg-4 container mt-5 pt-3'>
                        {render()}
                    </div>
                </div>
                <div className="d-lg-none d-block">
                    <nav className="navbar text-bg-white fixed-top">
                        <div className="container-fluid">
                            <div>
                                <img className="" src="Images/logo2.png" width="150px" alt="Logo" />
                            </div>
                            <div className='d-flex flex-row justify-content-center'>
                                <h5 className="text-coral" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </h5>
                            </div>
                            <div className="offcanvas offcanvas-end text-bg-white w-75" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                                <div className="offcanvas-header">
                                    <img className="" src="Images/logo2.png" width="150px" alt="Logo" />
                                    <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <ul className="navbar-nav justify-content-end gap-3 flex-grow-1 pe-3">
                                        <h5 className={` ${component === 'Dashboard' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Dashboard')}>
                                            <BsGrid1X2Fill className='icon' />  Dashboard
                                        </h5>
                                        <h5 className={` ${component === 'Products' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Products')}>
                                            <BsFillArchiveFill className='icon' />  Products
                                        </h5>
                                        <h5 className={` ${component === 'Orders' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Orders')}>
                                            <BsCartFill className='icon' />   Orders
                                        </h5>
                                        <h5 className={` ${component === 'Loans' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Loans')}>
                                            <BsCurrencyRupee className='icon' /> Loans
                                        </h5>
                                        <h5 className={` ${component === 'Users' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Users')}>
                                            <BsPeopleFill className='icon' /> Users
                                        </h5>
                                        <h5 className={` ${component === 'Profile' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Profile')}>
                                            <BsPersonCircle className='icon' /> Profile
                                        </h5>
                                        <h5 className={` ${component === 'Admins' ? 'text-coral' : ''} sidebar-list-item`} onClick={() => componentrender('Admins')}>
                                            <BsPeopleFill className='icon' />   Admins
                                        </h5>
                                    </ul>
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
