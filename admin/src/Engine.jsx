import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Account from './pages/Account';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Admins from './pages/Admins';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import ContactMessages from './pages/ContactMessages';
import VehicleSales from './pages/VehicleSales';
import { useAuth } from './AuthProvider';
import {
   BsBell
} from 'react-icons/bs';

const Engine = ({ component, componentrender }) => {
    const { authFetch, logout } = useAuth();
    const API_URL = process.env.REACT_APP_API_URL;
    // Global loan notification logic
    const [loanNotification, setLoanNotification] = useState('');
    const seenLoanIds = useRef(new Set());
    useEffect(() => {
        const fetchLoanApps = async (showNotification = false) => {
            try {
                const res = await authFetch(`${API_URL}/api/loan-applications`);
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

            {/* Mobile Navbar - Always rendered but only visible on mobile */}
            <MobileNavbar componentrender={componentrender} component={component} />

            {/* Fixed Sidebar - Desktop only */}
            <div style={{ width: 240, minWidth: 220, maxWidth: 260, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 101, background: '#fff', borderRight: '1.5px solid #e5e7eb', boxShadow: '2px 0 16px rgba(30,58,138,0.06)' }} className='d-none d-lg-block'>
                <Navbar componentrender={componentrender} component={component} isMobile={false} />
            </div>
            
            {/* Main Content Area */}
            <div
                style={{ marginLeft: 240, flex: 1, minWidth: 0 }}
                className='pt-0 pb-0 main-content-area'
            >
                <div className='mt-lg-4 container mt-5 pt-3' style={{ paddingTop: '80px' }}>
                    {render()}
                </div>
            </div>
        </div>
    )
}

export default Engine;