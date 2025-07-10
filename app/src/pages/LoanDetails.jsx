import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import image1 from '../assets/image 11.jpg'
import image2 from '../assets/image 4.jpg'
import image3 from '../assets/image 6.jpg'
import image4 from '../assets/image 8.jpg'
import image5 from '../assets/image 12.jpg'
import image6 from '../assets/image 10.jpg'
import { FaCheckCircle, FaUserShield, FaFileAlt, FaRegQuestionCircle, FaRegClock, FaRegMoneyBillAlt, FaArrowRight, FaPhoneAlt, FaCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

const loans = [
  {
    id: 1,
    title: "Old Bike Loan",
    description: `For customers looking to buy a reliable pre-owned two-wheeler, with fast approval, low EMIs, and minimal paperwork. Ideal for daily commuters and first-time buyers.\nEnjoy flexible repayment options and competitive interest rates tailored for your needs. Our expert team guides you through every step, ensuring a hassle-free experience. With minimal documentation and quick disbursal, you can get on the road faster. Choose from a wide range of eligible models and benefit from our transparent process with no hidden charges.`,
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
    description: `Finance your dream bike with up to 100% on-road price funding, low interest rates, and instant approval. Perfect for enthusiasts and daily riders.\nBenefit from exclusive offers for salaried and self-employed individuals. Our digital process ensures instant approval and minimal down payment. Enjoy doorstep documentation and personalized customer support. Ride away with your new bike sooner, thanks to our fast-track loan processing.`,
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
    description: `Expand your business fleet with easy loans for pre-owned commercial vehicles. Get high LTV, flexible repayment, and support for all vehicle types.\nOur loans are designed for small businesses and fleet owners seeking affordable solutions. Benefit from customized EMI plans and funding for all makes and models. Quick processing and expert assistance help you grow your business without delays. We support first-time buyers and offer guidance throughout the purchase process.`,
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
    description: `Buy a quality pre-owned car with affordable EMIs, fast approval, and transparent process. Suitable for families and professionals.\nWe offer up to 90% funding of car value and flexible tenure up to 60 months. Enjoy attractive interest rates and no prepayment penalty. Our hassle-free transfer process and dedicated support make your car buying journey smooth and secure. Choose from a wide selection of eligible vehicles and drive home your dream car today.`,
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
    description: `Unlock the value of your gold instantly. Get cash in minutes with minimal paperwork, high per-gram rates, and secure storage.\nOur gold loans offer flexible repayment options and no income proof required. Benefit from safe and secure storage of your valuables. Transparent process ensures you get the best value for your gold. Use the funds for any personal or business need, with quick approval and disbursal.`,
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
    description: `Leverage your residential or commercial property for a high-value loan. Enjoy long tenure, low rates, and multi-purpose usage.\nAvail loans up to ₹50 Lakhs with tenure up to 15 years. Use the funds for business expansion, education, or personal needs. Our quick processing and balance transfer facility make it easy to manage your finances. Benefit from attractive interest rates and expert guidance throughout the process.`,
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
    description: `Meet any personal need—wedding, travel, education, or emergency—with a quick, collateral-free loan. Fast approval and flexible EMIs.\nNo collateral required and minimal documentation for your convenience. Enjoy competitive interest rates and prepayment facility. Funds are disbursed quickly to help you meet urgent needs. Our customer support team is always available to assist you at every step.`,
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

// Add generic eligibility, documents, benefits, process, and FAQ data for each loan type
const loanDetailsExtras = {
  1: {
    eligibility: [
      'Indian resident, age 21-60',
      'Salaried or self-employed',
      'Valid driving license',
      'Good repayment history (if any previous loans)'
    ],
    documents: [
      'KYC documents (Aadhaar, PAN)',
      'Address proof',
      'Income proof (salary slip/ITR)',
      'Bank statement (last 3 months)',
      'Vehicle RC (if refinancing)'
    ],
    benefits: [
      'Quick approval & disbursal',
      'Low EMI options',
      'Minimal paperwork',
      'Attractive interest rates',
      'No hidden charges'
    ],
    process: [
      'Apply online or visit branch',
      'Submit documents',
      'Loan approval & agreement',
      'Funds disbursed to seller or your account'
    ],
    faqs: [
      {q: 'What is the maximum funding for old bike loans?', a: 'Up to 90% of the bike value can be funded.'},
      {q: 'How long does approval take?', a: 'Approval is usually within 24-48 hours after document submission.'},
      {q: 'Can I prepay the loan?', a: 'Yes, prepayment is allowed with no penalty.'}
    ]
  },
  // ... repeat for other loan types with realistic, generic content ...
};

const API_URL = process.env.REACT_APP_API_URL;

const LoanDetails = () => {
  const { id } = useParams();
  const loan = loans.find(l => l.id === Number(id));
  const [principal, setPrincipal] = useState(loan ? loan.amount : 100000);
  const [rate, setRate] = useState(loan ? loan.rate : 8.5);
  const [tenure, setTenure] = useState(12);
  const emi = calculateEMI(principal, rate, tenure);
  const totalPayable = emi * tenure;
  const [emiAnimated, setEmiAnimated] = useState(emi);
  const [totalAnimated, setTotalAnimated] = useState(totalPayable);
  const totalInterest = totalAnimated - principal;

  // Animate EMI and total when values change
  useEffect(() => {
    let frame;
    let startEmi = emiAnimated;
    let startTotal = totalAnimated;
    let start = null;
    const duration = 500;
    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setEmiAnimated(Math.round(startEmi + (emi - startEmi) * progress));
      setTotalAnimated(Math.round(startTotal + (totalPayable - startTotal) * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [emi, totalPayable]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: principal, message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const applyBtnRef = useRef(null);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/loan-applications`, {
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

  const extras = loanDetailsExtras[loan.id] || {};

  // For donut chart (new, larger, double ring, animated ticks, sparkles)
  const donutSize = 260;
  const donutStroke = 22;
  const donutRadius = donutSize / 2 - donutStroke / 2;
  const donutCircum = 2 * Math.PI * donutRadius;
  const donutPercent = Math.min((principal / totalPayable) * 100, 100);
  const donutOffset = donutCircum - (donutPercent / 100) * donutCircum;
  // For animated ticks
  const tickCount = 36;
  const ticks = Array.from({length: tickCount});
  // For animated sparkles
  const sparkleCount = 8;
  const sparkleAngles = Array.from({length: sparkleCount}, (_, i) => (i / sparkleCount) * 2 * Math.PI + (Math.PI / sparkleCount));

  const handleShowModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (!loan) {
    return <div className="container" style={{padding: '64px 0', textAlign: 'center'}}>Loan not found.</div>;
  }

  return (
    <div className="container loan-details-glass" style={{padding: '64px 0', maxWidth: 1100}}>
      {/* Hero Section */}
      <motion.div className="loan-hero-glass" initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{duration:0.7, type:'spring'}}>
        <motion.img src={loan.image} alt={loan.title} className="loan-hero-img-glass" initial={{scale:0.9}} animate={{scale:1}} transition={{duration:0.17, type:'spring'}}/>
        <div className="loan-hero-content-glass">
          <h1>{loan.title}</h1>
          <p className="loan-hero-desc-glass">{loan.description}</p>
          <div className="loan-hero-tags-glass">
            <span><FaRegMoneyBillAlt /> Interest: <b>{loan.rate}%</b></span>
            <span><FaRegClock /> Max Amount: <b>₹{loan.amount.toLocaleString()}</b></span>
          </div>
        </div>
      </motion.div>
      {/* Features & Benefits Section */}
      <motion.div className="glass-section-grid" initial="hidden" animate="visible" variants={{hidden:{opacity:0, y:30}, visible:{opacity:1, y:0, transition:{staggerChildren:0.12}}}}>
        {[...Array(3)].map((_, idx) => (
          <motion.div
            className="glass-card"
            key={idx}
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', duration: 0.25, delay: idx * 0.07 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{scale:1.03, boxShadow:'0 12px 48px rgba(59,130,246,0.18)'}}
          >
            {idx === 0 && (<><h3><FaCheckCircle className="glass-icon" /> Features</h3><ul className="glass-list">{loan.features.map((f, i) => <li key={i}><FaCheckCircle className="glass-list-icon" /> {f}</li>)}</ul></>)}
            {idx === 1 && (<><h3><FaUserShield className="glass-icon" /> Eligibility</h3><ul className="glass-list">{(extras.eligibility || ['Indian resident', 'Age 21-60', 'Salaried or self-employed']).map((e, i) => <li key={i}><FaUserShield className="glass-list-icon" /> {e}</li>)}</ul></>)}
            {idx === 2 && (<><h3><FaFileAlt className="glass-icon" /> Required Documents</h3><ul className="glass-list">{(extras.documents || ['KYC documents', 'Address proof', 'Income proof']).map((d, i) => <li key={i}><FaFileAlt className="glass-list-icon" /> {d}</li>)}</ul></>)}
          </motion.div>
        ))}
      </motion.div>
      {/* Process Section */}
      <motion.div
        className="glass-card glass-process"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 0.25, delay: 0.21 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h3><FaArrowRight className="glass-icon" /> How It Works</h3>
        <ol className="glass-process-list">
          {(extras.process || ['Apply online', 'Submit documents', 'Approval', 'Disbursal']).map((step, i) => <li key={i}><span className="glass-step-num">{i+1}</span> {step}</li>)}
        </ol>
      </motion.div>
      {/* EMI Calculator Section (Redesigned to match Mahindra Finance) */}
      <h3 style={{marginLeft: 22}}><FaArrowRight className="glass-icon" /> EMI Calculator</h3>
      <motion.div
        className="glass-card emi-calc-mahindra"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 0.35, delay: 0.28 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="emi-mahindra-grid">
          {/* Left: Inputs */}
          <div className="emi-mahindra-inputs">
            <div className="emi-mahindra-field">
              <label>Select Your Loan Type</label>
              <select
                className="emi-mahindra-input"
                value={loan.id}
                onChange={e => {
                  const selected = loans.find(l => l.id === Number(e.target.value));
                  if (selected) {
                    setPrincipal(selected.amount);
                    setRate(selected.rate);
                    setTenure(12);
                    window.location.href = `/loans/${selected.id}`;
                  }
                }}
                style={{marginBottom: 8}}
              >
                {loans.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
            <div className="emi-mahindra-field">
              <label>Loan Amount</label>
              <input type="range" min={100000} max={2500000} step={10000} value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="emi-mahindra-slider" />
              <div className="emi-mahindra-range-labels">
                <span>₹ 1L</span>
                <span>₹ 1Cr</span>
              </div>
              <input type="number" value={principal} min={100000} max={2500000} step={10000} onChange={e => setPrincipal(Number(e.target.value))} className="emi-mahindra-input" />
            </div>
            <div className="emi-mahindra-field">
              <label>Rate of interest (p.a)</label>
              <input type="range" min={1} max={20} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="emi-mahindra-slider" />
              <div className="emi-mahindra-range-labels">
                <span>1%</span>
                <span>20%</span>
              </div>
              <input type="number" value={rate} min={1} max={20} step={0.1} onChange={e => setRate(Number(e.target.value))} className="emi-mahindra-input" />
            </div>
            <div className="emi-mahindra-field">
              <label>Tenure(Months)</label>
              <input type="range" min={1} max={60} step={1} value={tenure} onChange={e => setTenure(Number(e.target.value))} className="emi-mahindra-slider" />
              <div className="emi-mahindra-range-labels">
                <span>1</span>
                <span>60</span>
              </div>
              <input type="number" value={tenure} min={1} max={60} step={1} onChange={e => setTenure(Number(e.target.value))} className="emi-mahindra-input" />
            </div>
          </div>
          {/* Right: Donut Chart & Results */}
          <div className="emi-mahindra-results">
            <svg width="280" height="280" className="emi-mahindra-donut" viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="115" stroke="#e5e7eb" strokeWidth="24" fill="none" />
              <circle
                cx="140"
                cy="140"
                r="115"
                stroke="#2563eb"
                strokeWidth="24"
                fill="none"
                strokeDasharray={2 * Math.PI * 115}
                strokeDashoffset={(2 * Math.PI * 115) - ((principal / (emi * tenure)) * 2 * Math.PI * 115)}
                style={{transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)'}}
              />
              <text x="140" y="130" textAnchor="middle" fontSize="1.2rem" fill="#1e3a8a" fontWeight="600">Total Amount Payable</text>
              <text x="140" y="165" textAnchor="middle" fontSize="2.1rem" fill="#2563eb" fontWeight="700">₹ {totalAnimated ? totalAnimated.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</text>
            </svg>
            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', width:'100%', marginTop:8}}>
              <div className="emi-mahindra-breakdown-card">
                <div className="emi-mahindra-breakdown-row">
                  <span className="emi-mahindra-breakdown-label" style={{flex: 1, whiteSpace: 'nowrap'}}>Principal Amount</span>
                  <span className="emi-mahindra-breakdown-value" style={{display:'inline-block', minWidth:250, textAlign:'right', marginLeft:'auto', whiteSpace: 'nowrap'}}>₹ {principal.toLocaleString()}</span>
                </div>
                <div className="emi-mahindra-breakdown-row interest">
                  <span className="emi-mahindra-breakdown-label" style={{flex: 1, whiteSpace: 'nowrap'}}>Total Interest</span>
                  <span className="emi-mahindra-breakdown-value" style={{display:'inline-block', minWidth:280, textAlign:'right', marginLeft:'auto', whiteSpace: 'nowrap'}}>₹ {totalInterest > 0 ? totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</span>
                </div>
                <div className="emi-mahindra-breakdown-row total">
                  <span className="emi-mahindra-breakdown-label" style={{flex: 1, whiteSpace: 'nowrap'}}>Total Amount</span>
                  <span className="emi-mahindra-breakdown-value" style={{display:'inline-block', minWidth:290, textAlign:'right', marginLeft:'auto', whiteSpace: 'nowrap'}}>₹ {totalAnimated ? totalAnimated.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</span>
              </div>
              </div>
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', marginTop:18, background:'#f3f4f6', borderRadius:10, padding:'10px 14px'}}>
              <div style={{fontSize:'1.08rem', color:'#1e3a8a', fontWeight:600}}>Monthly EMI</div>
              <div style={{fontSize:'1.25rem', fontWeight:700, color:'#2563eb', letterSpacing:1}}>₹ {emiAnimated ? emiAnimated.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
              <button
                className="emi-mahindra-apply"
                ref={applyBtnRef}
                onClick={handleShowModal}
                style={{marginLeft:16}}
              >
                APPLY NOW
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      {/* FAQ Section */}
      <motion.div
        className="glass-card glass-faq"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 0.35, delay: 0.35 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h3><FaRegQuestionCircle className="glass-icon" /> Frequently Asked Questions</h3>
        <div className="glass-faq-list">
          {(extras.faqs || [
            {q: 'Who can apply?', a: 'Any Indian resident aged 21-60 with valid documents.'},
            {q: 'How fast is approval?', a: 'Usually within 24-48 hours after submitting documents.'}
          ]).map((faq, i) => (
            <details key={i} className="glass-faq-item">
              <summary>{faq.q}</summary>
              <div>{faq.a}</div>
            </details>
          ))}
        </div>
      </motion.div>
      {/* Contact/Help Section */}
      <motion.div
        className="glass-card glass-help"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 0.45, delay: 0.42 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h3><FaPhoneAlt className="glass-icon" /> Need Help?</h3>
        <p>Call us at <a href="tel:+919999999999">+91 9486281880</a> or <Link to="/contact">contact us online</Link> for assistance.</p>
      </motion.div>
      {/* Application Modal (modernized glass style) */}
      {showModal && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          // background: 'transparent',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(30,58,138,0.18)',
            padding: 36,
            minWidth: 340,
            maxWidth: 400,
            width: 400,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            boxSizing: 'border-box',
          }}>
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default LoanDetails; 