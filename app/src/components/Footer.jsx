import { Link } from 'react-router-dom';
import logo from '../assets/skmt logo (1).png';

const Footer = () => {
  return (
    <footer className="footer modern-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logo} alt="SKMT Finance Logo" className="footer-logo" />
          <div>
            <h2 className="footer-title">SKMT Finance</h2>
            <p className="footer-tagline">Your trusted partner for all financial needs.</p>
          </div>
        </div>
        <div className="footer-sections">
          <div className="footer-section">
            <h4>About</h4>
            <p className="footer-about">We provide comprehensive financial solutions with integrity and excellence.</p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/share/15oiRLoLhS/" className="footer-social" aria-label="Facebook">
                {/* Facebook SVG */}
                <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M15.5 8.5h-2V7.5c0-.4.3-.5.5-.5h1.5V5h-2c-1.7 0-2.5 1.3-2.5 2.5V8.5h-1.5V11h1.5v5h2.5v-5h1.7l.3-2.5z" fill="#fff"/></svg>
              </a>
              {/* <a href="#" className="footer-social" aria-label="Twitter">
                Twitter SVG
                <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M19 8.3c-.4.2-.8.3-1.2.4.4-.2.7-.6.9-1-.4.2-.8.4-1.2.5-.4-.4-1-.7-1.6-.7-1.2 0-2.1 1-2.1 2.1 0 .2 0 .4.1.6-1.7-.1-3.2-.9-4.2-2.1-.2.4-.3.7-.3 1.1 0 .7.4 1.3 1 1.7-.3 0-.6-.1-.8-.2v.1c0 1 .7 1.8 1.6 2-.2.1-.4.1-.7.1-.1 0-.2 0-.3-.1.2.7.9 1.2 1.7 1.2-0.6.5-1.3.8-2.1.8-.1 0-.2 0-.3 0 .7.5 1.6.8 2.5.8 3 0 4.7-2.5 4.7-4.7v-.2c.3-.2.6-.5.8-.8z" fill="#fff"/></svg>
              </a> */}
              {/* <a href="#" className="footer-social" aria-label="LinkedIn">
                LinkedIn SVG
                <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M8.5 10.5h2v5h-2v-5zm1-1.5c-.7 0-1.2-.6-1.2-1.2 0-.7.5-1.3 1.2-1.3.7 0 1.2.6 1.2 1.3 0 .6-.5 1.2-1.2 1.2zm2.5 1.5h2v.7c.3-.5.9-.8 1.5-.8 1.1 0 2 .9 2 2.2v3h-2v-2.7c0-.5-.2-.8-.7-.8s-.8.3-.8.8v2.7h-2v-5z" fill="#fff"/></svg>
              </a> */}
              <a href="https://www.instagram.com/skmt_cars_and_autos?igsh=MTFremI5azY1MnFp" className="footer-social" aria-label="Instagram">
                {/* Instagram SVG */}
                <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5ZM17 7.5a1 1 0 1 0 0 2 1 1 0 1 0 0-2ZM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" fill="#fff"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Loans</h4>
            <ul className="footer-links">
              <li><Link to="/loans">Old Bike Loan</Link></li>
              <li><Link to="/loans">New Bike Loan</Link></li>
              <li><Link to="/loans">Old Commercial Vehicle Loan</Link></li>
              <li><Link to="/loans">Old Cars Loan</Link></li>
              <li><Link to="/loans">Gold Loan</Link></li>
              <li><Link to="/loans">Property Loan</Link></li>
              <li><Link to="/loans">Personal Loan</Link></li>
            </ul>
          </div>
          {/* <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Loan Calculator</Link></li>
              <li><Link to="/services">Online Application</Link></li>
              <li><Link to="/services">Customer Support</Link></li>
              <li><Link to="/services">Branch Locator</Link></li>
              <li><Link to="/services">EMI Services</Link></li>
            </ul>
          </div> */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="/about">Careers</a></li>
              <li><a href="/about">Investor Relations</a></li>
              {/* <li><a href="#">Press Releases</a></li> */}
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>Contact No: +91 97519 50880</p>
              <p>osthimanikkam@gmail.com</p>
              <p>SKMT Finance</p>
              <p>Sivagiri Bus stop,</p>
              <p>Linga Gounden Valasu, Sivagiri.</p>
              <span>Tamil Nadu 638109, India</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>&copy; 2025 SKMT finance. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;