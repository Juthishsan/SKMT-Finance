import React, { useState } from 'react';
import skmtLogo from '../assets/skmt logo (1).png';
import {
  BsGrid1X2Fill, BsFillArchiveFill, BsPeopleFill, BsPersonCircle, BsCartFill, BsCurrencyRupee, BsEnvelopeFill, BsCarFrontFill
} from 'react-icons/bs';
import { useAuth } from '../AuthProvider';
import Swal from 'sweetalert2';

const navItems = [
  { label: 'Dashboard', icon: <BsGrid1X2Fill size={22} />, key: 'Dashboard' },
  { label: 'Vehicles', icon: <BsFillArchiveFill size={22} />, key: 'Products' },
  { label: 'Vehicle Sales', icon: <BsCarFrontFill size={22} />, key: 'VehicleSales' },
  { label: 'Orders', icon: <BsCartFill size={22} />, key: 'Orders' },
  { label: 'Loans', icon: <BsCurrencyRupee size={22} />, key: 'Loans' },
  { label: 'Users', icon: <BsPeopleFill size={22} />, key: 'Users' },
  { label: 'Admins', icon: <BsPeopleFill size={22} />, key: 'Admins' },
  { label: 'Contact Messages', icon: <BsEnvelopeFill size={22} />, key: 'ContactMessages' },
  { label: 'Profile', icon: <BsPersonCircle size={22} />, key: 'Profile' },
];

const Navbar = ({ componentrender, component }) => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Logged out Successfully',
      showConfirmButton: false,
      timer: 2000,
      background: '#fff',
      // iconColor: '#22c55e',
    }).then(async (result) => {
      if (result.isDismissed) {
        await logout();
      }
    }, 1000);
  };

  return (
    <>
      <aside
        style={{
          height: '100vh',
          background: '#fff',
          borderRight: '1.5px solid #e5e7eb',
          boxShadow: '2px 0 16px rgba(30,58,138,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 0 16px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <img src={skmtLogo} alt="SKMT Logo" style={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 16, marginBottom: 8, boxShadow: '0 2px 8px #1e3a8a22' }} />
          <span style={{ fontWeight: 700, fontSize: 20, color: '#1e3a8a', letterSpacing: 1, marginBottom: 2 }}>SKMT Admin</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
          <nav style={{ width: '100%', flex: 1 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
              {navItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => componentrender(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 32px',
                    fontWeight: 600,
                    fontSize: 17,
                    color: component === item.key ? '#1e3a8a' : '#222',
                    background: component === item.key ? 'linear-gradient(90deg, #e0e7ff 0%, #fff 100%)' : 'transparent',
                    borderLeft: component === item.key ? '4px solid #1e3a8a' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                    borderRadius: '0 24px 24px 0',
                    marginBottom: 4,
                  }}
                  className="sidebar-list-item"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={handleLogout}
            style={{
              marginTop: 'auto',
              marginBottom: 8,
              width: '90%',
              alignSelf: 'center',
              background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s',
              minWidth: 120,
              maxWidth: 240,
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#dc2626', marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Logout?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to logout? This will end your admin session.</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setShowLogoutModal(false)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmLogout} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;