import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const formCardRef = useRef(null);
  const [formCardHeight, setFormCardHeight] = useState(undefined);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg('');
    setSubmitError('');
    try {
      const res = await fetch(`${API_URL}/api/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }
      setSubmitMsg('Thank you for your inquiry! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      setSubmitError(err.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (formCardRef.current) {
      setFormCardHeight(formCardRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (formCardRef.current) {
        setFormCardHeight(formCardRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [formData, submitting, submitMsg, submitError]);

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <div className="text-center">
            <h1>Contact Us</h1>
            <p>Get in touch with us for all your financial needs. Our team is here to help you every step of the way.</p>
          </div>
        </div>
      </section>

      {/* Redesigned Contact Form and Info Side by Side */}
      <section className="section">
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Left: Contact Form */}
            <motion.div
              ref={formCardRef}
              style={{ flex: '1 1 380px', minWidth: 320, maxWidth: 600, borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)', background: '#fff', overflow: 'hidden', marginBottom: 32 }}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.45, duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', padding: '28px 0 18px 0', textAlign: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0, fontSize: 26 }}>Send us a Message</h2>
                {/* <p style={{ color: '#e0e7ef', fontWeight: 500, margin: 0, fontSize: 16 }}>Fill out the form below and we'll get back to you as soon as possible.</p> */}
              </div>
              <form onSubmit={handleSubmit} className="contact-form" style={{ padding: 36 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div className="form-row" style={{ display: 'flex', gap: 18 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="name" style={{ color: '#1e3a8a', fontWeight: 600 }}>Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="email" style={{ color: '#1e3a8a', fontWeight: 600 }}>Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      />
                    </div>
                  </div>
                  <div className="form-row" style={{ display: 'flex', gap: 18 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="phone" style={{ color: '#1e3a8a', fontWeight: 600 }}>Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="service" style={{ color: '#1e3a8a', fontWeight: 600 }}>Service Interest</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      >
                        <option value="">Select a service</option>
                        <option value="vehicle-loan">Vehicle Loan</option>
                        <option value="home-loan">Home Loan</option>
                        <option value="personal-loan">Personal Loan</option>
                        <option value="business-loan">Business Loan</option>
                        <option value="gold-loan">Gold Loan</option>
                        <option value="insurance">Insurance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" style={{ color: '#1e3a8a', fontWeight: 600 }}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tell us about your requirements..."
                      style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                      onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                      onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                    ></textarea>
                  </div>
                  {submitMsg && <div style={{ color: '#10b981', marginBottom: 12, fontWeight: 600 }}>{submitMsg}</div>}
                  {submitError && <div style={{ color: '#dc2626', marginBottom: 12, fontWeight: 600 }}>{submitError}</div>}
                  <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', fontWeight: 700, fontSize: 20, borderRadius: 14, padding: '14px 0', marginTop: 10, boxShadow: '0 4px 16px #1e3a8a22', border: 'none', transition: 'background 0.18s, box-shadow 0.18s', cursor: submitting ? 'not-allowed' : 'pointer' }} onMouseOver={e => e.currentTarget.style.background='linear-gradient(90deg, #3b82f6 60%, #1e3a8a 100%)'} onMouseOut={e => e.currentTarget.style.background='linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)'}>{submitting ? 'Sending...' : 'Send Message'}</button>
                </div>
              </form>
            </motion.div>
            {/* Right: Get in Touch Section */}
            <motion.div
              style={{ flex: '1 1 380px', minWidth: 320, maxWidth: 600, borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)', background: '#fff', overflow: 'hidden', marginBottom: 32, display: 'flex', flexDirection: 'column', minHeight: formCardHeight ? formCardHeight : undefined }}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.45, duration: 0.8, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', padding: '28px 0 18px 0', textAlign: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0, fontSize: 26 }}>Get in Touch</h2>
                {/* <p style={{ color: '#e0e7ef', fontWeight: 500, margin: 0, fontSize: 16 }}>Reach out to us through any of these channels. We're here to help!</p> */}
              </div>
              <div className="contact-info-section" style={{ padding: 36, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="contact-methods" style={{ display: 'flex', flexDirection: 'column', gap: 70 }}>
                  {[
                    {
                      icon: '📞',
                      title: 'Call us',
                      details: [
                        'Contact No: +91 9486281880',
                      ]
                    },
                    {
                      icon: '✉️',
                      title: 'Email us',
                      details: [
                        'skmtfinanceandconsulting@gmail.com',
                        `We'll respond within 24 hours`
                      ]
                    },
                    {
                      icon: '📍',
                      title: 'Visit us',
                      details: [
                        'SKMT Finance',
                        'Sivagiri Bus stop,',
                        'Linga Gounden Valasu, Sivagiri.',
                        'Tamil Nadu 638109, India'
                      ]
                    }
                  ].map((method, idx) => (
                    <motion.div
                      className="contact-method"
                      key={method.title}
                      initial={{ opacity: 0, y: 40, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', duration: 0.30, delay: idx * 0.15 }}
                      viewport={{ once: true, amount: 0.2 }}
                      style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 8px #1e3a8a11', padding: 18, display: 'flex', alignItems: 'flex-start', gap: 16 }}
                    >
                      <div className="method-icon" style={{ fontSize: 28, marginRight: 8 }}>{method.icon}</div>
                      <div className="method-details">
                        <h4 style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 18, margin: 0 }}>{method.title}</h4>
                        {method.details.map((d, i) => <p key={i} style={{ color: '#334155', fontWeight: 500, margin: 0 }}>{d}</p>)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about our services</p>
          </div>
          
          <div className="faq-grid">
            {[
              {
                q: 'What documents do I need for a loan application?',
                a: `Generally, you'll need identity proof, address proof, income proof, and bank statements. Specific requirements may vary based on the loan type.`
              },
              {
                q: 'How long does the loan approval process take?',
                a: 'Our quick approval process can get you approved within 24-48 hours for most loan types, subject to document verification.'
              },
              {
                q: 'Can I apply for a loan online?',
                a: 'Yes, you can apply for all our loan products online through our website or mobile app. The process is completely digital and secure.'
              },
              {
                q: 'What is the minimum credit score required?',
                a: `We typically require a credit score of 650 and above, but we evaluate applications holistically considering various factors.`
              },
              {
                q: 'Are there any prepayment charges?',
                a: 'Prepayment charges vary by loan type. Many of our loan products have zero prepayment charges. Please check specific terms for your loan.'
              },
              {
                q: 'How can I track my loan application status?',
                a: 'You can track your application status online through our customer portal, mobile app, or by calling our customer service team.'
              }
            ].map((faq, idx) => (
              <motion.div
                className="faq-item"
                key={faq.q}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="section bg-primary">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Get Started?</h2>
            <p>Our team is standing by to help you with your financial needs</p>
            <div className="cta-buttons">
              <a href="tel:1800-123-4567" className="btn btn-secondary">Call Now</a>
              <button className="btn btn-outline" style={{color: 'white', borderColor: 'white'}}>Schedule a Call</button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;