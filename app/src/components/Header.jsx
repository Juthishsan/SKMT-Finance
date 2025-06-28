import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import skmtLogo from '../assets/skmt logo (1).png';
import { toast } from 'react-toastify';

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

  return (
    <header className="header">
      <div className="nav-wrapper">
        <div className="nav-left-group" style={{display: 'flex', alignItems: 'center', gap: 32}}>
          <Link to="/" className="logo" style={{display: 'flex', alignItems: 'center'}}>
            <img src={skmtLogo} alt="SKMT Logo" style={{height: '80px', width: '100px', objectFit: 'contain'}} />
            <span className="logo-text" style={{ color: '#111' }}>SKMT Finance</span>
          </Link>
        </div>
        <div className="nav-right-group" style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Vehicles
            </Link>
            <div 
              className="nav-link loans-dropdown-wrapper" 
              onMouseEnter={() => setLoansDropdown(true)} 
              onMouseLeave={() => setLoansDropdown(false)}
              style={{ position: 'relative' }}
            >
              <Link
                to="/loans"
                className={location.pathname === '/loans' ? 'active' : ''}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Loans ▾
              </Link>
              {loansDropdown && (
                <div className="loans-dropdown-menu">
                  {loanOptions.map((loan) => (
                    <Link 
                      key={loan.title} 
                      to={`/loans/${loan.id}`}
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {loan.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link 
              to="/services" 
              className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <span
                  style={{
                    fontWeight: 600,
                    color: '#1e3a8a',
                    marginRight: 16,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 20,
                    padding: '6px 16px',
                    background: location.pathname === '/profile' ? 'linear-gradient(90deg, #e0e7ff 0%, #fff 100%)' : 'transparent',
                    boxShadow: location.pathname === '/profile' ? '0 2px 8px #1e3a8a22' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => navigate('/profile')}
                  title="View Profile"
                >
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c7d2fe 0%, #f0fdfa 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#1e3a8a',
                  }}>{user.username ? user.username[0].toUpperCase() : '?'}</span>
                  {user.username}
                </span>
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline blur-login" style={{marginRight: 8}}>Login</Link>
                <Link to="/register" className="btn btn-secondary" style={{marginRight: 8}}>Register</Link>
              </>
            )}
            {/* <Link to="/contact" className="btn btn-primary">Apply Now</Link>
            <button className="mobile-menu-btn" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;