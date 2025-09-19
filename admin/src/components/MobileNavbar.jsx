import React, { useState, useEffect } from 'react';
import skmtLogo from '../assets/SKMT Logo (3).png';
import {
  BsGrid1X2Fill, BsFillArchiveFill, BsPeopleFill, BsPersonCircle, BsCartFill, BsCurrencyRupee, BsEnvelopeFill, BsCarFrontFill
} from 'react-icons/bs';
import { HiMenuAlt3 } from 'react-icons/hi';
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

const MobileNavbar = ({ componentrender, component }) => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sync menu state with Bootstrap offcanvas events
  useEffect(() => {
    const offcanvasElement = document.getElementById('offcanvasDarkNavbar');
    
    const handleShow = () => setIsMenuOpen(true);
    const handleHide = () => setIsMenuOpen(false);
    
    if (offcanvasElement) {
      offcanvasElement.addEventListener('show.bs.offcanvas', handleShow);
      offcanvasElement.addEventListener('hide.bs.offcanvas', handleHide);
      
      return () => {
        offcanvasElement.removeEventListener('show.bs.offcanvas', handleShow);
        offcanvasElement.removeEventListener('hide.bs.offcanvas', handleHide);
      };
    }
  }, []);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Logged out Successfully',
      showConfirmButton: false,
      timer: 2000,
      background: '#fff',
    }).then(async () => {
      await logout();
      componentrender('Login');
      document.querySelector('#offcanvasDarkNavbar .btn-close')?.click();
    });
  };

  // Custom Hamburger Icon Component
  const HamburgerIcon = ({ isOpen, onClick }) => (
    <div
      style={{
        width: '30px',
        height: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={onClick}
    >
      <span
        style={{
          width: '24px',
          height: '3px',
          backgroundColor: '#fff',
          borderRadius: '2px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'rotate(0deg) translate(0, 0)',
          transformOrigin: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
        }}
      />
      <span
        style={{
          width: '24px',
          height: '3px',
          backgroundColor: '#fff',
          borderRadius: '2px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
          opacity: isOpen ? 0 : 1,
          margin: '4px 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
        }}
      />
      <span
        style={{
          width: '24px',
          height: '3px',
          backgroundColor: '#fff',
          borderRadius: '2px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'rotate(0deg) translate(0, 0)',
          transformOrigin: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
        }}
      />
      {/* Ripple effect overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          borderRadius: '50%',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />
    </div>
  );

  //console.log('MobileNavbar component is rendering');

  return (
    <>
      {/* Mobile Navbar */}
      <div 
        className="d-lg-none d-block" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          zIndex: 1200, 
          display: 'block !important',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '8px'
        }}
      >
        <div style={{ 
          background: '#fff', 
          borderRadius: 20, 
          boxShadow: '0 8px 32px rgba(30,58,138,0.2)', 
          padding: 0,
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <nav className="navbar text-bg-white" style={{ 
            boxShadow: 'none', 
            minHeight: 70, 
            borderRadius: 20, 
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <div className="container-fluid d-flex align-items-center justify-content-between" style={{ 
              padding: '0 10px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={skmtLogo} 
                  alt="SKMT Logo" 
                  style={{ 
                    width: 120, 
                    height: 60, 
                    objectFit: 'contain', 
                    borderRadius: 12, 
                    boxShadow: '0 4px 16px rgba(30,58,138,0.15)',
                    border: '2px solid rgba(30,58,138,0.1)'
                  }} 
                />
              </div>
               <div className='d-flex flex-row justify-content-center'>
                 <button 
                   className="navbar-toggler" 
                   type="button" 
                   data-bs-toggle="offcanvas" 
                   data-bs-target="#offcanvasDarkNavbar" 
                   aria-controls="offcanvasDarkNavbar" 
                   aria-label="Toggle navigation" 
                   style={{ 
                     border: 'none', 
                     background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
                     display: 'flex !important', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     padding: '10px', 
                     margin: 0, 
                     height: 56, 
                     width: 56, 
                     borderRadius: '16px',
                     boxShadow: '0 8px 25px rgba(30,58,138,0.4), 0 4px 12px rgba(30,58,138,0.3)',
                     visibility: 'visible !important',
                     opacity: '1 !important',
                     cursor: 'pointer',
                     transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   onClick={handleMenuToggle}
                   onMouseEnter={(e) => {
                     e.target.style.transform = 'scale(1) rotate(0deg)';
                     e.target.style.boxShadow = '0 12px 35px rgba(30,58,138,0.6), 0 8px 20px rgba(30,58,138,0.4)';
                     e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.transform = 'scale(1) rotate(0deg)';
                     e.target.style.boxShadow = '0 8px 25px rgba(30,58,138,0.4), 0 4px 12px rgba(30,58,138,0.3)';
                     e.target.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
                   }}
                   onMouseDown={(e) => {
                     e.target.style.transform = 'scale(0.95) rotate(-2deg)';
                     e.target.style.transition = 'all 0.1s ease';
                   }}
                   onMouseUp={(e) => {
                     e.target.style.transform = 'scale(1) rotate(0deg)';
                     e.target.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                   }}
                 >
                   <HamburgerIcon isOpen={isMenuOpen} onClick={handleMenuToggle} />
                 </button>
               </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Offcanvas Menu */}
      <div 
        className="offcanvas offcanvas-end custom-offcanvas w-75" 
        tabIndex="-1" 
        id="offcanvasDarkNavbar" 
        aria-labelledby="offcanvasDarkNavbarLabel" 
        style={{ 
          borderRadius: 24, 
          border: '4px solid #fff', 
          boxShadow: '0 2px 24px rgba(30,58,138,0.13)' 
        }}
      >
        <div className="offcanvas-header" style={{ 
          borderBottom: '1px solid #e5e7eb', 
          padding: '20px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={skmtLogo} 
              alt="SKMT Logo" 
              style={{ 
                width: 120, 
                height: 60, 
                objectFit: 'contain', 
                borderRadius: 12, 
                boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)'
              }} 
            />
            <div>
              <h5 style={{ margin: 0, color: '#fff', fontWeight: '700' }}>SKMT Admin</h5>
              {/* <small style={{ color: 'rgba(255,255,255,0.8)' }}>Navigation Menu</small> */}
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            data-bs-dismiss="offcanvas" 
            aria-label="Close"
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '35px',
              height: '35px'
            }}
          ></button>
        </div>
        <div className="offcanvas-body p-0" style={{ padding: 0 }}>
          <ul className="navbar-nav gap-2 flex-grow-1 pe-3" style={{ padding: 16 }}>
            {navItems.map((item) => (
              <li
                key={item.key}
                className={`sidebar-list-item py-3 px-2 ${component === item.key ? 'text-coral' : ''}`}
                style={{ 
                  borderRadius: 10, 
                  fontWeight: 600, 
                  fontSize: 18, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  cursor: 'pointer', 
                  transition: 'background 0.18s' 
                }}
                onClick={() => { 
                  componentrender(item.key); 
                  document.querySelector('#offcanvasDarkNavbar .btn-close')?.click(); 
                }}
              >
                {item.icon}
                {item.label}
              </li>
            ))}
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

export default MobileNavbar;
