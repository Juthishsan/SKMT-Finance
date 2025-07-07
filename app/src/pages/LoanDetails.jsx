import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import image1 from '../assets/image 11.jpg'
import image2 from '../assets/image 4.jpg'
import image3 from '../assets/image 6.jpg'
import image4 from '../assets/image 8.jpg'
import image5 from '../assets/image 12.jpg'
import image6 from '../assets/image 10.jpg'
import { FaCheckCircle, FaUserShield, FaFileAlt, FaRegQuestionCircle, FaRegClock, FaRegMoneyBillAlt, FaArrowRight, FaPhoneAlt, FaCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (!loan) {
    return <div className="container" style={{padding: '64px 0', textAlign: 'center'}}>Loan not found.</div>;
  }

  return (
    <div className="container loan-details-glass" style={{padding: '64px 0', maxWidth: 1100}}>
      {/* Hero Section */}
      <motion.div className="loan-hero-glass" initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{duration:0.7, type:'spring'}}>
        <motion.img src={loan.image} alt={loan.title} className="loan-hero-img-glass" initial={{scale:0.9}} animate={{scale:1}} transition={{duration:0.7, type:'spring'}}/>
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
        {[...Array(4)].map((_, idx) => (
          <motion.div className="glass-card" key={idx} variants={{hidden:{opacity:0, y:30}, visible:{opacity:1, y:0}}} whileHover={{scale:1.03, boxShadow:'0 12px 48px rgba(59,130,246,0.18)'}}>
            {idx === 0 && (<><h3><FaCheckCircle className="glass-icon" /> Features</h3><ul className="glass-list">{loan.features.map((f, i) => <li key={i}><FaCheckCircle className="glass-list-icon" /> {f}</li>)}</ul></>)}
            {idx === 1 && (<><h3><FaUserShield className="glass-icon" /> Eligibility</h3><ul className="glass-list">{(extras.eligibility || ['Indian resident', 'Age 21-60', 'Salaried or self-employed']).map((e, i) => <li key={i}><FaUserShield className="glass-list-icon" /> {e}</li>)}</ul></>)}
            {idx === 2 && (<><h3><FaFileAlt className="glass-icon" /> Required Documents</h3><ul className="glass-list">{(extras.documents || ['KYC documents', 'Address proof', 'Income proof']).map((d, i) => <li key={i}><FaFileAlt className="glass-list-icon" /> {d}</li>)}</ul></>)}
            {idx === 3 && (<><h3><FaCheckCircle className="glass-icon" /> Benefits</h3><ul className="glass-list">{(extras.benefits || ['Quick approval', 'Low EMI', 'Minimal paperwork']).map((b, i) => <li key={i}><FaCheckCircle className="glass-list-icon" /> {b}</li>)}</ul></>)}
          </motion.div>
        ))}
      </motion.div>
      {/* Process Section */}
      <motion.div className="glass-card glass-process" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.2, duration:0.7, type:'spring'}}>
        <h3><FaArrowRight className="glass-icon" /> How It Works</h3>
        <ol className="glass-process-list">
          {(extras.process || ['Apply online', 'Submit documents', 'Approval', 'Disbursal']).map((step, i) => <li key={i}><span className="glass-step-num">{i+1}</span> {step}</li>)}
        </ol>
      </motion.div>
      {/* EMI Calculator Section (Mahindra-inspired, enhanced, new donut, sparkles) */}
      <motion.div className="glass-card glass-emi-calc emi-calc-mahindra" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.3, duration:0.7, type:'spring'}}>
        <div className="emi-mahindra-grid">
          {/* Left: Inputs */}
          <div className="emi-mahindra-inputs">
            <div className="emi-mahindra-field">
              <label>Loan Amount</label>
              <input type="range" min={100000} max={2500000} step={10000} value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="emi-mahindra-slider" />
              <div className="emi-mahindra-range-labels">
                <span>₹ 1L</span>
                <span>₹ 25L</span>
              </div>
              <input type="number" value={principal} min={100000} max={2500000} step={10000} onChange={e => setPrincipal(Number(e.target.value))} className="emi-mahindra-input" />
            </div>
            <div className="emi-mahindra-field">
              <label>Rate of interest (p.a)</label>
              <input type="range" min={6} max={26} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="emi-mahindra-slider" />
              <div className="emi-mahindra-range-labels">
                <span>6%</span>
                <span>26%</span>
              </div>
              <input type="number" value={rate} min={6} max={26} step={0.1} onChange={e => setRate(Number(e.target.value))} className="emi-mahindra-input" />
            </div>
            <div className="emi-mahindra-field">
              <label>Tenure (Months)</label>
              <input type="range" min={12} max={60} step={1} value={tenure} onChange={e => setTenure(Number(e.target.value))} className="emi-mahindra-slider" />
              <div className="emi-mahindra-range-labels">
                <span>12</span>
                <span>60</span>
              </div>
              <input type="number" value={tenure} min={12} max={60} step={1} onChange={e => setTenure(Number(e.target.value))} className="emi-mahindra-input" />
            </div>
          </div>
          {/* Right: Donut Chart & Results */}
          <div className="emi-mahindra-results">
            <motion.svg width={donutSize} height={donutSize} className="emi-mahindra-donut emi-donut-3d" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:0.7, type:'spring'}}>
              {/* Outer Glow Ring */}
              <circle
                stroke="url(#donutGlow)"
                fill="transparent"
                strokeWidth={donutStroke + 8}
                r={donutRadius}
                cx={donutSize/2}
                cy={donutSize/2}
                style={{filter:'blur(6px)', opacity:0.25}}
              />
              {/* Background Ring */}
              <circle
                stroke="#e5e7eb"
                fill="transparent"
                strokeWidth={donutStroke}
                r={donutRadius}
                cx={donutSize/2}
                cy={donutSize/2}
              />
              {/* Progress Ring (animated gradient) */}
              <motion.circle
                stroke="url(#donutGradient)"
                fill="transparent"
                strokeWidth={donutStroke}
                strokeDasharray={donutCircum + ' ' + donutCircum}
                style={{ strokeDashoffset: donutOffset, filter:'drop-shadow(0 2px 12px #38bdf8)' }}
                r={donutRadius}
                cx={donutSize/2}
                cy={donutSize/2}
                initial={{strokeDashoffset: donutCircum}}
                animate={{strokeDashoffset: donutOffset}}
                transition={{duration:0.7, type:'spring'}}
                strokeLinecap="round"
              />
              {/* Animated Ticks */}
              {ticks.map((_, i) => {
                const angle = (i / tickCount) * 2 * Math.PI;
                const x1 = donutSize/2 + Math.cos(angle) * (donutRadius - donutStroke/2 - 4);
                const y1 = donutSize/2 + Math.sin(angle) * (donutRadius - donutStroke/2 - 4);
                const x2 = donutSize/2 + Math.cos(angle) * (donutRadius + donutStroke/2 - 2);
                const y2 = donutSize/2 + Math.sin(angle) * (donutRadius + donutStroke/2 - 2);
                const active = i < Math.round(tickCount * donutPercent / 100);
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={active ? 'url(#donutGradient)' : '#e5e7eb'}
                    strokeWidth={active ? 3.5 : 2}
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    transition={{delay:0.2 + i*0.01}}
                  />
                );
              })}
              {/* Animated Sparkles */}
              {sparkleAngles.map((angle, i) => {
                const r = donutRadius + donutStroke/2 + 10;
                const x = donutSize/2 + Math.cos(angle) * r;
                const y = donutSize/2 + Math.sin(angle) * r;
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={7}
                    fill="url(#sparkleGradient)"
                    style={{filter:'blur(0.5px)'}}
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.4, 1],
                      x: [0, Math.cos(angle)*6, 0],
                      y: [0, Math.sin(angle)*6, 0]
                    }}
                    transition={{
                      duration: 1.8 + i*0.13,
                      repeat: Infinity,
                      repeatType: 'loop',
                      delay: i*0.18
                    }}
                  />
                );
              })}
              {/* Center Glassy Badge */}
              <g>
                <ellipse cx={donutSize/2} cy={donutSize/2} rx={donutRadius-32} ry={donutRadius-38} fill="url(#centerGlass)" filter="url(#glassShadow)" />
                <text x={donutSize/2} y={donutSize/2-12} textAnchor="middle" fontSize="1.1rem" fill="#1e3a8a" fontWeight="600">Total Amount Payable</text>
                <motion.text x={donutSize/2} y={donutSize/2+22} textAnchor="middle" fontSize="2.1rem" fill="#2563eb" fontWeight="700" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}>
                  ₹ {totalAnimated ? totalAnimated.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                </motion.text>
              </g>
              {/* SVG Gradients & Filters */}
              <defs>
                <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <radialGradient id="donutGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                </radialGradient>
                <radialGradient id="centerGlass" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#e0e7ef" stopOpacity="0.7" />
                </radialGradient>
                <radialGradient id="sparkleGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </radialGradient>
                <filter id="glassShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.13" />
                </filter>
              </defs>
            </motion.svg>
            <div className="emi-mahindra-breakdown">
              <div className="emi-mahindra-legend">
                <FaCircle style={{color:'#1e3a8a', fontSize:12, marginRight:6}}/> Principal Amount
              </div>
              <div className="emi-mahindra-amount">₹ {principal.toLocaleString()}</div>
              <div className="emi-mahindra-legend">
                <FaCircle style={{color:'#e5e7eb', fontSize:12, marginRight:6}}/> Total Amount
              </div>
              <div className="emi-mahindra-amount">₹ {totalAnimated ? totalAnimated.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
            </div>
            <div className="emi-mahindra-emi-row">
              <div>Monthly EMI</div>
              <div className="emi-mahindra-emi">₹ {emiAnimated ? emiAnimated.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
              <motion.button className="emi-mahindra-apply" whileHover={{scale:1.05, background:'linear-gradient(90deg, #3b82f6 60%, #1e3a8a 100%)'}} onClick={() => setShowModal(true)}>
                APPLY NOW
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      {/* FAQ Section */}
      <motion.div className="glass-card glass-faq" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.4, duration:0.7, type:'spring'}}>
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
      <motion.div className="glass-card glass-help" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.5, duration:0.7, type:'spring'}}>
        <h3><FaPhoneAlt className="glass-icon" /> Need Help?</h3>
        <p>Call us at <a href="tel:+919999999999">+91 99999 99999</a> or <Link to="/contact">contact us online</Link> for assistance.</p>
      </motion.div>
      {/* Application Modal (modernized glass style) */}
      <AnimatePresence>
      {showModal && (
        <motion.div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,58,138,0.10)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
          <motion.div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.18)', padding: 36, minWidth: 340, maxWidth: 400, width: '100%', position: 'relative' }} initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.8, opacity:0}} transition={{type:'spring', duration:0.4}}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', border: 'none', fontSize: 22, color: '#1e3a8a', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: 18 }}>Apply for {loan.title}</h3>
            {submitted ? (
              <motion.div style={{ color: '#10b981', textAlign: 'center', fontWeight: 600, fontSize: 18, padding: 24 }} initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', duration:0.5}}>
                Application submitted successfully!
              </motion.div>
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
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default LoanDetails; 