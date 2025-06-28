import React from 'react';
import skmtLogo from '../assets/skmt logo (1).png';
import Swal from 'sweetalert2';
import {
  BsGrid1X2Fill, BsFillArchiveFill, BsPeopleFill, BsPersonCircle, BsCartFill, BsCurrencyRupee, BsEnvelopeFill
} from 'react-icons/bs';

const navItems = [
  { label: 'Dashboard', icon: <BsGrid1X2Fill size={22} />, key: 'Dashboard' },
  { label: 'Products', icon: <BsFillArchiveFill size={22} />, key: 'Products' },
  { label: 'Orders', icon: <BsCartFill size={22} />, key: 'Orders' },
  { label: 'Loans', icon: <BsCurrencyRupee size={22} />, key: 'Loans' },
  { label: 'Users', icon: <BsPeopleFill size={22} />, key: 'Users' },
  { label: 'Profile', icon: <BsPersonCircle size={22} />, key: 'Profile' },
  { label: 'Admins', icon: <BsPeopleFill size={22} />, key: 'Admins' },
  { label: 'Contact Messages', icon: <BsEnvelopeFill size={22} />, key: 'ContactMessages' },
];

const Navbar = ({ componentrender, component }) => {
    const logout = async () => {
        Swal.fire({
      icon: 'success',
      title: 'Logged out',
      text: 'You have been logged out successfully.',
            showConfirmButton: false,
      timer: 1200,
        });
    localStorage.removeItem('adminEmail');
    componentrender('Login');
    };

    return (
    <aside
      style={{
        minHeight: '100vh',
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
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <img src={skmtLogo} alt="SKMT Logo" style={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 16, marginBottom: 8, boxShadow: '0 2px 8px #1e3a8a22' }} />
        <span style={{ fontWeight: 700, fontSize: 20, color: '#1e3a8a', letterSpacing: 1, marginBottom: 2 }}>SKMT Admin</span>
                    </div>
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
        onClick={logout}
        style={{
          marginTop: 32,
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
        }}
      >
                            Logout
                        </button>
    </aside>
    );
};

export default Navbar;
