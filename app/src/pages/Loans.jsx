import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import image1 from '../assets/image 11.jpg'
import image2 from '../assets/image 4.jpg'
import image3 from '../assets/image 6.jpg'
import image4 from '../assets/image 8.jpg'
import image5 from '../assets/image 12.jpg'
import image6 from '../assets/image 10.jpg'

const Loans = () => {
  const loans = [
    {
      id: 1,
      title: "Old Bike Loan",
      description: "For customers looking to buy a reliable pre-owned two-wheeler, with fast approval, low EMIs, and minimal paperwork. Ideal for daily commuters and first-time buyers.",
      image: image1,
      features: [
        "Up to 90% funding of bike value",
        "Flexible tenure up to 36 months",
        "Quick approval & disbursal",
        "Simple documentation",
        "Attractive interest rates",
        "No hidden charges"
      ],
      rate: "10.5% onwards",
      amount: "Up to ₹2 Lakhs"
    },
    {
      id: 2,
      title: "New Bike Loan",
      description: "Finance your dream bike with up to 100% on-road price funding, low interest rates, and instant approval. Perfect for enthusiasts and daily riders.",
      image: image2,
      features: [
        "Up to 100% on-road price funding",
        "Tenure up to 48 months",
        "Fast digital approval",
        "Minimal down payment",
        "Special offers for salaried/self-employed",
        "Doorstep documentation"
      ],
      rate: "9.5% onwards",
      amount: "Up to ₹3 Lakhs"
    },
    {
      id: 3,
      title: "Old Commercial Vehicle Loan",
      description: "Expand your business fleet with easy loans for pre-owned commercial vehicles. Get high LTV, flexible repayment, and support for all vehicle types.",
      image: image3,
      features: [
        "Up to 85% funding of vehicle value",
        "Tenure up to 60 months",
        "Quick processing",
        "Funding for all makes/models",
        "Customized EMI plans",
        "Support for first-time buyers"
      ],
      rate: "11.0% onwards",
      amount: "Up to ₹10 Lakhs"
    },
    {
      id: 4,
      title: "Old Cars Loan",
      description: "Buy a quality pre-owned car with affordable EMIs, fast approval, and transparent process. Suitable for families and professionals.",
      image: image4,
      features: [
        "Up to 90% funding of car value",
        "Flexible tenure up to 60 months",
        "Quick loan approval",
        "Attractive interest rates",
        "No prepayment penalty",
        "Hassle-free transfer process"
      ],
      rate: "10.0% onwards",
      amount: "Up to ₹8 Lakhs"
    },
    {
      id: 5,
      title: "Gold Loan",
      description: "Unlock the value of your gold instantly. Get cash in minutes with minimal paperwork, high per-gram rates, and secure storage.",
      image: image5,
      features: [
        "Instant cash disbursal",
        "High per-gram rates",
        "Flexible repayment options",
        "No income proof required",
        "Safe & secure storage",
        "Transparent process"
      ],
      rate: "8.5% onwards",
      amount: "Up to ₹5 Lakhs"
    },
    {
      id: 6,
      title: "Property Loan",
      description: "Leverage your residential or commercial property for a high-value loan. Enjoy long tenure, low rates, and multi-purpose usage.",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&fit=crop&w=600&q=80",
      features: [
        "High loan amounts (up to ₹50 Lakhs)",
        "Tenure up to 15 years",
        "Attractive interest rates",
        "Use for business, education, or personal needs",
        "Quick processing",
        "Balance transfer facility"
      ],
      rate: "9.0% onwards",
      amount: "Up to ₹50 Lakhs"
    },
    {
      id: 7,
      title: "Personal Loan",
      description: "Meet any personal need—wedding, travel, education, or emergency—with a quick, collateral-free loan. Fast approval and flexible EMIs.",
      image: image6,
      features: [
        "No collateral required",
        "Tenure up to 60 months",
        "Fast approval & disbursal",
        "Minimal documentation",
        "Competitive interest rates",
        "Prepayment facility"
      ],
      rate: "12.0% onwards",
      amount: "Up to ₹5 Lakhs"
    }
  ];

  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/loan-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, loanType: selectedLoan.title })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setForm({ name: '', email: '', phone: '', amount: '', message: '' });
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="loans">
      {/* Hero Section */}
      <section className="loans-hero">
        <div className="container">
          <div className="text-center">
            <h1>Our Financial Loans</h1>
            <p>Comprehensive financial solutions tailored to meet your diverse needs and aspirations</p>
          </div>
        </div>
      </section>

      {/* Loans Grid */}
      <section className="section">
        <div className="container">
          <div className="loans-grid">
            {loans.map(loan => (
              <div key={loan.id} className="loan-card-detailed" onClick={() => navigate(`/loans/${loan.id}`)} style={{ cursor: 'pointer' }}>
                <div className="loan-image">
                  <img src={loan.image} alt={loan.title} />
                </div>
                <div className="loan-info">
                  <h3>{loan.title}</h3>
                  <p>{loan.description}</p>
                  {/* <div className="loan-highlights">
                    <div className="highlight-item">
                      <span className="highlight-label">Interest Rate</span>
                      <span className="highlight-value">{loan.rate}</span>
                    </div>
                    <div className="highlight-item">
                      <span className="highlight-label">Loan Amount</span>
                      <span className="highlight-value">{loan.amount}</span>
                    </div>
                  </div> */}
                  {/* <div className="loan-features">
                    <h4>Key Features</h4>
                    <ul>
                      {loan.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div> */}
                  <div className="loan-actions">
                    <button className="btn btn-primary" onClick={e => { e.stopPropagation(); setSelectedLoan(loan); setShowModal(true); }}>Apply Now</button>
                    <Link to="/services" className="btn btn-outline" onClick={e => e.stopPropagation()}>Calculate EMI</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Why Choose Our Loans?</h2>
            <p>Experience the advantages of banking with SKMT finance</p>
          </div>
          <div className="grid grid-4">
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h4>Quick Approval</h4>
              <p>Get loan approvals in as little as 24 hours with our streamlined process</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h4>Competitive Rates</h4>
              <p>Enjoy some of the most competitive interest rates in the market</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📋</div>
              <h4>Minimal Documentation</h4>
              <p>Simple documentation process with digital submission options</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h4>Expert Support</h4>
              <p>Get guidance from our experienced financial advisors throughout your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>General Eligibility Criteria</h2>
            <p>Check if you meet our basic eligibility requirements</p>
          </div>
          <div className="grid grid-2">
            <div className="eligibility-card">
              <h3>Individual Applicants</h3>
              <ul className="eligibility-list">
                <li>✓ Age: 21 to 65 years</li>
                <li>✓ Minimum income: ₹25,000 per month</li>
                <li>✓ Employment: Salaried or Self-employed</li>
                <li>✓ Credit score: 650 and above</li>
                <li>✓ Valid identity and address proof</li>
                <li>✓ Bank statements for last 6 months</li>
              </ul>
            </div>
            <div className="eligibility-card">
              <h3>Business Applicants</h3>
              <ul className="eligibility-list">
                <li>✓ Business vintage: 2+ years</li>
                <li>✓ Annual turnover: ₹10 Lakhs+</li>
                <li>✓ Valid business registration</li>
                <li>✓ ITR for last 2 years</li>
                <li>✓ Bank statements (Current & Savings)</li>
                <li>✓ Financial statements (audited)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="section bg-primary">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Apply?</h2>
            <p>Take the next step towards achieving your financial goals</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-secondary">Apply Now</Link>
              <Link to="/services" className="btn btn-outline" style={{color: 'white', borderColor: 'white'}}>Calculate EMI</Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Popup Modal Form */}
      {showModal && selectedLoan && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,58,138,0.10)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.18)', padding: 36, minWidth: 340, maxWidth: 400, width: '100%', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', border: 'none', fontSize: 22, color: '#1e3a8a', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: 18 }}>Apply for {selectedLoan.title}</h3>
            {submitted ? (
              <div style={{ color: '#10b981', textAlign: 'center', fontWeight: 600, fontSize: 18, padding: 24 }}>Application submitted successfully!</div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600 }}>Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600 }}>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600 }}>Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleFormChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600 }}>Loan Amount</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleFormChange} required min={10000} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 600 }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleFormChange} rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #c7d2fe', fontSize: 15, marginTop: 4 }} />
                </div>
                {error && <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: 10 }}>{error}</div>}
                <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', letterSpacing: 1 }}>Submit Application</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans; 