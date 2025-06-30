import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import skmtLogo from '../assets/skmt logo (1).png';
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
  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on navigation
  const handleNavClick = () => {
    setIsMenuOpen(false);
    setLoansDropdown(false);
    setVehiclesDropdown(false);
  };

  return (
    <header className="header">
      <div className="nav-wrapper">
        <div className="nav-left-group">
          <Link to="/" className="logo" aria-label="SKMT Finance Home">
            <img src={skmtLogo} alt="SKMT Logo" className="logo-img" />
            <span className="logo-title-modern">SKMT <span>Finance</span></span>
          </Link>
        </div>
        <button
          className={`mobile-menu-btn${isMenuOpen ? ' open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="custom-hamburger">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
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
              onMouseEnter={() => setVehiclesDropdown(true)} 
              onMouseLeave={() => setVehiclesDropdown(false)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={vehiclesDropdown}
              style={{ position: 'relative' }}
              onClick={() => setVehiclesDropdown((v) => !v)}
            >
              <Link
                to="/products"
                className={location.pathname.startsWith('/products') || location.pathname === '/sell-vehicle' ? 'active' : ''}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                onClick={() => { handleNavClick(); setVehiclesDropdown(false); }}
              >
                <MdDirectionsCar className="nav-icon" /> Vehicles ▾
              </Link>
              {vehiclesDropdown && (
                <div className="vehicles-dropdown-menu">
                  <Link 
                    to="/products"
                    className="dropdown-item"
                    onClick={() => { handleNavClick(); setVehiclesDropdown(false); }}
                  >
                    <MdDirectionsCar className="nav-icon" style={{marginRight: 6}} /> All Vehicles
                  </Link>
                  <Link 
                    to="/sell-vehicle"
                    className="dropdown-item"
                    onClick={() => { handleNavClick(); setVehiclesDropdown(false); }}
                  >
                    <MdDirectionsCar className="nav-icon" style={{marginRight: 6}} /> Sell Your Vehicle
                  </Link>
                </div>
              )}
            </div>
            <div 
              className="nav-link loans-dropdown-wrapper" 
              onMouseEnter={() => setLoansDropdown(true)} 
              onMouseLeave={() => setLoansDropdown(false)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={loansDropdown}
              style={{ position: 'relative' }}
            >
              <Link
                to="/loans"
                className={location.pathname === '/loans' ? 'active' : ''}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                onClick={handleNavClick}
              >
                <MdAccountBalance className="nav-icon" /> Loans ▾
              </Link>
              {loansDropdown && (
                <div className="loans-dropdown-menu">
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
            {/* <Link 
              to="/services" 
              className={`nav-link${location.pathname === '/services' ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <MdBuild className="nav-icon" /> Services
            </Link> */}
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
                  <Link to="/login" className="btn btn-outline blur-login" style={{width: '100%', marginTop: 8}} onClick={handleNavClick}>Login</Link>
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
                <Link to="/login" className="btn btn-outline blur-login" onClick={handleNavClick}>Login</Link>
                <Link to="/register" className="btn btn-secondary" onClick={handleNavClick}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;