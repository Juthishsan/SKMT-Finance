import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import image1 from '../assets/image 11.jpg'
import image2 from '../assets/image 4.jpg'
import image3 from '../assets/image 6.jpg'
import image4 from '../assets/image 8.jpg'
import image5 from '../assets/image 12.jpg'
import image6 from '../assets/image 10.jpg'

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
    rate: 10.5,
    amount: 200000
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
    rate: 9.5,
    amount: 300000
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
    rate: 11.0,
    amount: 1000000
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
    rate: 10.0,
    amount: 800000
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
    rate: 8.5,
    amount: 500000
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
    rate: 9.0,
    amount: 5000000
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
    rate: 12.0,
    amount: 500000
  }
];

function calculateEMI(principal, rate, tenure) {
  if (!principal || !rate || !tenure) return 0;
  const monthlyRate = rate / 12 / 100;
  const n = tenure;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

const LoanDetails = () => {
  const { id } = useParams();
  const loan = loans.find(l => l.id === Number(id));
  const [principal, setPrincipal] = useState(loan ? loan.amount : 100000);
  const [rate, setRate] = useState(loan ? loan.rate : 8.5);
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: principal, message: '' });
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
      const res = await fetch(`http://localhost:5000/api/loan-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, loanType: loan.title })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setForm({ name: '', email: '', phone: '', amount: principal, message: '' });
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!loan) {
    return <div className="container" style={{padding: '64px 0', textAlign: 'center'}}>Loan not found.</div>;
  }

  return (
    <div className="container" style={{padding: '64px 0', maxWidth: 1100}}>
      <div style={{display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap'}}>
        <img src={loan.image} alt={loan.title} style={{width: 340, borderRadius: 12, boxShadow: '0 4px 24px rgba(30,58,138,0.10)'}} />
        <div style={{flex: 1, minWidth: 260}}>
          <h1 style={{marginBottom: 8}}>{loan.title}</h1>
          <div style={{fontSize: '1.1rem', color: '#1e3a8a', marginBottom: 8}}>{loan.description}</div>
          <ul style={{margin: '12px 0 18px 0', paddingLeft: 18}}>
            {loan.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <div style={{marginBottom: 8}}><strong>Interest Rate:</strong> {loan.rate}%</div>
          <div style={{marginBottom: 8}}><strong>Max Loan Amount:</strong> ₹{loan.amount.toLocaleString()}</div>
        </div>
      </div>
      {/* EMI Calculator Section */}
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
        <button className="emi-calc-apply" onClick={() => setShowModal(true)}>APPLY NOW</button>
      </div>

      {/* Popup Modal Form */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,58,138,0.10)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.18)', padding: 36, minWidth: 340, maxWidth: 400, width: '100%', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', border: 'none', fontSize: 22, color: '#1e3a8a', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: 18 }}>Apply for {loan.title}</h3>
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

export default LoanDetails; 