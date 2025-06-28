import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SKMT finance</h4>
            <p>Your trusted partner for all financial needs. We provide comprehensive financial solutions with integrity and excellence.</p>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Instagram</a>
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

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Loan Calculator</Link></li>
              <li><Link to="/services">Online Application</Link></li>
              <li><Link to="/services">Customer Support</Link></li>
              <li><Link to="/services">Branch Locator</Link></li>
              <li><Link to="/services">EMI Services</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investor Relations</a></li>
              <li><a href="#">Press Releases</a></li>
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
            {/* <div className="newsletter">
              <h5>Newsletter</h5>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button className="btn btn-secondary">Subscribe</button>
              </div>
            </div> */}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 SKMT finance. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;