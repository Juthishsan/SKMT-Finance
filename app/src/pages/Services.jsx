import { useState } from 'react';

function calculateEMI(principal, rate, tenure) {
  if (!principal || !rate || !tenure) return 0;
  const monthlyRate = rate / 12 / 100;
  const n = tenure;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

const Services = () => {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(12);
  const emi = calculateEMI(principal, rate, tenure);
  const totalPayable = emi * tenure;

  // For circular progress
  const percent = Math.min((principal / totalPayable) * 100, 100);
  const radius = 140;
  const stroke = 22;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div className="text-center">
            <h1>Our Services</h1>
            <p>Comprehensive financial services designed to make your journey smoother and more convenient</p>
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      {/* <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>EMI Calculator</h2>
            <p style={{fontSize: '1.08rem', color: '#444', marginBottom: 32}}>Calculate your monthly EMI and total loan cost instantly using the sliders below.</p>
          </div>
          <div className="emi-calc-wrap">
            <div className="emi-calc-left">
              <div className="emi-calc-field">
                <label>Loan Amount</label>
                <input type="range" min={100000} max={2500000} step={10000} value={principal} onChange={e => setPrincipal(Number(e.target.value))} />
                <div className="emi-calc-range-labels">
                  <span>₹ 1L</span>
                  <span>₹ 25L</span>
                </div>
                <input type="number" value={principal} min={100000} max={2500000} step={10000} onChange={e => setPrincipal(Number(e.target.value))} className="emi-calc-input" />
              </div>
              <div className="emi-calc-field">
                <label>Rate of interest (p.a)</label>
                <input type="range" min={6} max={26} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} />
                <div className="emi-calc-range-labels">
                  <span>6%</span>
                  <span>26%</span>
                </div>
                <input type="number" value={rate} min={6} max={26} step={0.1} onChange={e => setRate(Number(e.target.value))} className="emi-calc-input" />
              </div>
              <div className="emi-calc-field">
                <label>Tenure (Months)</label>
                <input type="range" min={12} max={60} step={1} value={tenure} onChange={e => setTenure(Number(e.target.value))} />
                <div className="emi-calc-range-labels">
                  <span>12</span>
                  <span>60</span>
                </div>
                <input type="number" value={tenure} min={12} max={60} step={1} onChange={e => setTenure(Number(e.target.value))} className="emi-calc-input" />
              </div>
            </div>
            <div className="emi-calc-right">
              <svg width={300} height={300} style={{display: 'block', margin: '0 auto'}}>
                <circle
                  stroke="#e5e7eb"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={150}
                  cy={150}
                />
                <circle
                  stroke="#1e3a8a"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s' }}
                  r={normalizedRadius}
                  cx={150}
                  cy={150}
                />
                <text x="150" y="150" textAnchor="middle" dy=".3em" fontSize="1.7rem" fill="#222">
                  ₹ {totalPayable ? totalPayable.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                </text>
                <text x="150" y="110" textAnchor="middle" fontSize="1.1rem" fill="#888">Total Amount Payable</text>
              </svg>
              <div className="emi-calc-summary">
                <div>
                  <span className="emi-calc-dot" style={{background:'#1e3a8a'}}></span> Principal Amount
                  <div className="emi-calc-summary-value">₹ {principal.toLocaleString()}</div>
                </div>
                <div>
                  <span className="emi-calc-dot" style={{background:'#e5e7eb'}}></span> Total Amount
                  <div className="emi-calc-summary-value">₹ {totalPayable ? totalPayable.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="emi-calc-bottom">
            <div>Monthly EMI</div>
            <div className="emi-calc-emi">₹ {emi ? emi.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
            <a href="/contact" className="emi-calc-apply">APPLY NOW</a>
          </div>
        </div>
      </section> */}

      {/* Digital Services */}
      {/* <section className="section section-bg-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Digital Services</h2>
            <p>Experience the convenience of digital banking with our innovative online services</p>
          </div>
          <div className="grid grid-3">
            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Online Application</h3>
              <p>Apply for loans online with our simple and secure application process. Get approvals faster with minimal documentation.</p>
              <ul>
                <li>24/7 availability</li>
                <li>Secure document upload</li>
                <li>Real-time status tracking</li>
                <li>Instant pre-approval</li>
              </ul>
              <button className="btn btn-primary">Apply Online</button>
            </div>
            
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>Mobile Banking</h3>
              <p>Manage your loans and payments on the go with our user-friendly mobile banking application.</p>
              <ul>
                <li>Account management</li>
                <li>EMI payments</li>
                <li>Statement download</li>
                <li>Customer support</li>
              </ul>
              <button className="btn btn-primary">Download App</button>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🔒</div>
              <h3>Secure Portal</h3>
              <p>Access your loan account securely through our customer portal with advanced security features.</p>
              <ul>
                <li>Two-factor authentication</li>
                <li>Account statements</li>
                <li>Payment history</li>
                <li>Document repository</li>
              </ul>
              <button className="btn btn-primary">Access Portal</button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Customer Support Services */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Customer Support Services</h2>
            <p>We're here to help you every step of the way with comprehensive support services</p>
          </div>
          <div className="grid grid-2">
            <div className="support-card">
              <div className="support-header">
                <div className="support-icon">📞</div>
                <div>
                  <h3>24/7 Customer Helpline</h3>
                  <p>Get instant support for all your queries and concerns</p>
                </div>
              </div>
              <div className="support-details">
                <div className="contact-method">
                  <strong>Toll-Free:</strong> 1800-123-4567
                </div>
                <div className="contact-method">
                  <strong>Email:</strong> support@skmtfinance.com
                </div>
                <div className="contact-method">
                  <strong>Chat:</strong> Available on website & mobile app
                </div>
              </div>
            </div>
            
            <div className="support-card">
              <div className="support-header">
                <div className="support-icon">🏢</div>
                <div>
                  <h3>Branch Network</h3>
                  <p>Visit our extensive network of branches across India</p>
                </div>
              </div>
              <div className="support-details">
                <div className="contact-method">
                  <strong>Branches:</strong> 2,500+ locations
                </div>
                <div className="contact-method">
                  <strong>States:</strong> Present in all 28 states
                </div>
                <div className="contact-method">
                  <strong>Hours:</strong> Mon-Sat 9:30 AM - 6:30 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Additional Services</h2>
            <p>Comprehensive financial services to meet all your banking needs</p>
          </div>
          <div className="grid grid-4">
            <div className="additional-service">
              <div className="service-icon">📍</div>
              <h4>Branch Locator</h4>
              <p>Find the nearest branch or ATM with our interactive branch locator</p>
            </div>
            <div className="additional-service">
              <div className="service-icon">📄</div>
              <h4>Document Center</h4>
              <p>Access and download important documents, forms, and certificates</p>
            </div>
            <div className="additional-service">
              <div className="service-icon">💡</div>
              <h4>Financial Advisory</h4>
              <p>Get expert financial advice from our certified financial planners</p>
            </div>
            <div className="additional-service">
              <div className="service-icon">🎓</div>
              <h4>Financial Literacy</h4>
              <p>Learn about financial planning through our educational resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="section bg-primary">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Need Help with Our Services?</h2>
            <p>Our customer service team is ready to assist you with any questions or support you need</p>
            <div className="cta-buttons">
              <a href="tel:1800-123-4567" className="btn btn-secondary">Call Now</a>
              <button className="btn btn-outline" style={{color: 'white', borderColor: 'white'}}>Live Chat</button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Services;