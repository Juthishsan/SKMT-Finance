import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import skmtLogo from '../assets/skmt logo (1).png';
import skmtLogo1 from '../assets/SKMT Logo (3).png';
import { toast } from 'react-toastify';
import { MdHome, MdDirectionsCar, MdAccountBalance, MdBuild, MdInfo, MdContactPhone } from 'react-icons/md';

const loanOptions = [
  { title: 'Old Bike Loan', id: 1 },
  { title: 'New Bike Loan', id: 2 },
  { title: 'Old Commercial Vehicle Loan', id: 3 },
  { title: 'Old Cars Loan', id: 4 },
  { title: 'Gold Loan', id: 5 },
  { title: 'Property Loan', id: 6 },
  { title: 'Personal Loan', id: 7 },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loansDropdown, setLoansDropdown] = useState(false);
  const [vehiclesDropdown, setVehiclesDropdown] = useState(false);
  const [showMobileLoginDropdown, setShowMobileLoginDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1260);
  const location = useLocation();
  const navigate = useNavigate();
  const vehiclesDropdownTimeout = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1260);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // User logic
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    setTimeout(() => window.location.reload(), 800);
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // Close menu on navigation
  const handleNavClick = () => {
    setIsMenuOpen(false);
    setLoansDropdown(false);
    setVehiclesDropdown(false);
  };

  const openVehiclesDropdown = () => {
    clearTimeout(vehiclesDropdownTimeout.current);
    setVehiclesDropdown(true);
  };
  const closeVehiclesDropdown = () => {
    vehiclesDropdownTimeout.current = setTimeout(() => setVehiclesDropdown(false), 180);
  };

  return (
    <header className="header">
      <div className="nav-wrapper">
        <div className="nav-left-group">
          <Link to="/" className="logo" aria-label="SKMT Finance Home">
            <img src={skmtLogo1} alt="SKMT Logo" className="logo-img" />
            {/* <span className="logo-title-modern">SKMT <span>Finance</span></span> */}
          </Link>
        </div>
        {/* Move toggle button here for absolute visibility */}
        <button
          className={`simple-toggle-btn${isMenuOpen ? ' open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
          style={{marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', zIndex: 130, position: 'absolute', right: 16, top: 24}}
        >
          <span className="simple-toggle-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect className={`simple-bar top${isMenuOpen ? ' open' : ''}`} x="6" y="8" width="22" height="3" rx="1.5" />
              <rect className={`simple-bar middle${isMenuOpen ? ' open' : ''}`} x="6" y="16" width="22" height="3" rx="1.5" />
              <rect className={`simple-bar bottom${isMenuOpen ? ' open' : ''}`} x="6" y="23" width="22" height="3" rx="1.5" />
            </svg>
          </span>
        </button>
        <div className="nav-right-group">
          <nav className={`nav${isMenuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
            <Link 
              to="/" 
              className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <MdHome className="nav-icon" /> Home
            </Link>
            <div 
              className="nav-link vehicles-dropdown-wrapper" 
              style={{ position: 'relative' }}
              onMouseEnter={!isMobile ? openVehiclesDropdown : undefined}
              onMouseLeave={!isMobile ? closeVehiclesDropdown : undefined}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={vehiclesDropdown}
            >
              {isMobile ? (
                <span
                  className={location.pathname.startsWith('/products') || location.pathname === '/sell-vehicle' ? 'active' : ''}
                  style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}
                  onClick={() => setVehiclesDropdown(v => !v)}
                  role="button"
                  tabIndex={0}
                  aria-label="Toggle Vehicles dropdown"
                >
                  <MdDirectionsCar className="nav-icon" /> Vehicles ▾
                </span>
              ) : (
              <Link
                to="/products"
                className={location.pathname.startsWith('/products') || location.pathname === '/sell-vehicle' ? 'active' : ''}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                onClick={handleNavClick}
              >
                <MdDirectionsCar className="nav-icon" /> Vehicles ▾
              </Link>
              )}
              {vehiclesDropdown && (
                <div className="vehicles-dropdown-menu" style={{ position: isMobile ? 'relative' : 'absolute', left: 0, top: isMobile ? 'auto' : '100%', zIndex: 10 }}
                  onMouseEnter={!isMobile ? openVehiclesDropdown : undefined}
                  onMouseLeave={!isMobile ? closeVehiclesDropdown : undefined}
                >
                  <Link 
                    to="/products"
                    className="dropdown-item"
                    onClick={handleNavClick}
                  >
                    <MdDirectionsCar className="nav-icon" style={{marginRight: 6}} /> All Vehicles
                  </Link>
                  <Link 
                    to="/sell-vehicle"
                    className="dropdown-item"
                    onClick={handleNavClick}
                  >
                    <MdDirectionsCar className="nav-icon" style={{marginRight: 6}} /> Sell Your Vehicle
                  </Link>
                </div>
              )}
            </div>
            <div 
              className="nav-link loans-dropdown-wrapper" 
              onMouseEnter={!isMobile ? () => setLoansDropdown(true) : undefined} 
              onMouseLeave={!isMobile ? () => setLoansDropdown(false) : undefined}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={loansDropdown}
              style={{ position: 'relative' }}
            >
              {isMobile ? (
                <span
                  className={location.pathname === '/loans' ? 'active' : ''}
                  style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}
                  onClick={() => setLoansDropdown(v => !v)}
                  role="button"
                  tabIndex={0}
                  aria-label="Toggle Loans dropdown"
                >
                  <MdAccountBalance className="nav-icon" /> Loans ▾
                </span>
              ) : (
              <Link
                to="/loans"
                className={location.pathname === '/loans' ? 'active' : ''}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                onClick={handleNavClick}
              >
                <MdAccountBalance className="nav-icon" /> Loans ▾
              </Link>
              )}
              {loansDropdown && (
                <div className="loans-dropdown-menu" style={{ position: isMobile ? 'relative' : 'absolute', left: 0, top: isMobile ? 'auto' : '100%', zIndex: 10 }}>
                  <Link
                    to="/loans"
                    className="dropdown-item"
                    onClick={handleNavClick}
                  >
                    <MdAccountBalance className="nav-icon" style={{marginRight: 6}} /> All Loans
                  </Link>
                  {loanOptions.map((loan) => (
                    <Link 
                      key={loan.title} 
                      to={`/loans/${loan.id}`}
                      className="dropdown-item"
                      onClick={handleNavClick}
                    >
                      <MdAccountBalance className="nav-icon" style={{marginRight: 6}} /> {loan.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link 
              to="/about" 
              className={`nav-link${location.pathname === '/about' ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <MdInfo className="nav-icon" /> About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link${location.pathname === '/contact' ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <MdContactPhone className="nav-icon" /> Contact
            </Link>

            {/* Mobile: Show login/register/profile in menu */}
            <div className="mobile-auth-actions">
              {user ? (
                <>
                  <span
                    className={`profile-link${location.pathname === '/profile' ? ' active' : ''}`}
                    onClick={() => { navigate('/profile'); handleNavClick(); }}
                    title="View Profile"
                    tabIndex={0}
                    role="button"
                    aria-label="View Profile"
                  >
                    <span className="profile-avatar">{user.username ? user.username[0].toUpperCase() : '?'}</span>
                    {user.username}
                  </span>
                  <button className="btn btn-primary" style={{width: '100%', marginTop: 8}} onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <div style={{ position: 'relative', width: '100%', marginTop: 8 }}>
                    <button
                      className="btn btn-outline blur-login"
                      style={{ width: '100%' }}
                      onClick={() => setShowMobileLoginDropdown((v) => !v)}
                      type="button"
                    >
                      Login ▾
                    </button>
                    {showMobileLoginDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        background: '#fff',
                        borderRadius: 10,
                        boxShadow: '0 4px 16px rgba(30,58,138,0.10)',
                        zIndex: 100,
                        marginTop: 4,
                        overflow: 'hidden',
                      }}>
                        <Link to="/login" className="dropdown-item" style={{ display: 'block', padding: '12px 20px', color: '#1e3a8a', textDecoration: 'none', fontWeight: 600 }} onClick={() => { setShowMobileLoginDropdown(false); handleNavClick(); }}>User Login</Link>
                        <a href="https://skmtadmin.vercel.app/" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{ display: 'block', padding: '12px 20px', color: '#1e3a8a', textDecoration: 'none', fontWeight: 600 }} onClick={() => setShowMobileLoginDropdown(false)}>Admin Login</a>
                      </div>
                    )}
                  </div>
                  <Link to="/register" className="btn btn-secondary" style={{width: '100%', marginTop: 8}} onClick={handleNavClick}>Register</Link>
                </>
              )}
            </div>
          </nav>
          {/* Desktop: Show login/register/profile in header bar */}
          <div className="header-actions">
            {user ? (
              <>
                <span
                  className={`profile-link${location.pathname === '/profile' ? ' active' : ''}`}
                  onClick={() => { navigate('/profile'); handleNavClick(); }}
                  title="View Profile"
                  tabIndex={0}
                  role="button"
                  aria-label="View Profile"
                >
                  <span className="profile-avatar">{user.username ? user.username[0].toUpperCase() : '?'}</span>
                  {user.username}
                </span>
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    className="btn btn-outline blur-login"
                    style={{ minWidth: 100, fontWeight: 600 }}
                    onClick={() => setShowLoginDropdown((v) => !v)}
                    type="button"
                  >
                    Login ▾
                  </button>
                  {showLoginDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      minWidth: 160,
                      background: '#fff',
                      borderRadius: 10,
                      boxShadow: '0 4px 16px rgba(30,58,138,0.10)',
                      zIndex: 100,
                      marginTop: 4,
                      overflow: 'hidden',
                    }}>
                      <Link to="/login" className="dropdown-item" style={{ display: 'block', padding: '12px 20px', color: '#1e3a8a', textDecoration: 'none', fontWeight: 600 }} onClick={() => setShowLoginDropdown(false)}>User Login</Link>
                      <a href="https://skmtadmin.vercel.app/" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{ display: 'block', padding: '12px 20px', color: '#1e3a8a', textDecoration: 'none', fontWeight: 600 }} onClick={() => setShowLoginDropdown(false)}>Admin Login</a>
                    </div>
                  )}
                </div>
                <Link to="/register" className="btn btn-secondary" style={{marginLeft: 12}} onClick={handleNavClick}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;