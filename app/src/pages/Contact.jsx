import { useState } from 'react';

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
      const res = await fetch('http://localhost:5000/api/contact-messages', {
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

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="text-center">
            <h1>Contact Us</h1>
            <p>Get in touch with us for all your financial needs. Our team is here to help you every step of the way.</p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Service Interest</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
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
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>
                {submitMsg && <div style={{ color: '#10b981', marginBottom: 12, fontWeight: 600 }}>{submitMsg}</div>}
                {submitError && <div style={{ color: '#dc2626', marginBottom: 12, fontWeight: 600 }}>{submitError}</div>}
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</button>
              </form>
            </div>
            
            <div className="contact-info-section">
              <h2>Get in Touch</h2>
              <p>Reach out to us through any of these channels. We're here to help!</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📞</div>
                  <div className="method-details">
                    <h4>Call us</h4>
                    <p>Contact No: +91 97519 50880</p>
                    {/* <p>Customer Care: 022-1234-5678</p>
                    <span>Mon - Sat: 9:00 AM - 8:00 PM</span> */}
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">✉️</div>
                  <div className="method-details">
                    <h4>Email us</h4>
                    <p>osthimanikkam@gmail.com</p>
                    {/* <p>support@skmtfinance.com</p> */}
                    <span>We'll respond within 24 hours</span>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">📍</div>
                  <div className="method-details">
                    <h4>Visit us</h4>
                    <p>SKMT Finance</p>
                    <p>Sivagiri Bus stop,</p>
                    <p>Linga Gounden Valasu, Sivagiri.</p>
                    <span>Tamil Nadu 638109, India</span>
                  </div>
                </div>
                
                {/* <div className="contact-method">
                  <div className="method-icon">💬</div>
                  <div className="method-details">
                    <h4>Live Chat</h4>
                    <p>Available on website & mobile app</p>
                    <p>Instant support for quick queries</p>
                    <span>24/7 availability</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Locator */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Find a Branch Near You</h2>
            <p>With 2,500+ branches across India, we're always close to you</p>
          </div>
          
          <div className="branch-locator">
            <div className="locator-form">
              <h3>Branch Locator</h3>
              <div className="search-form">
                <input type="text" placeholder="Enter city, state, or PIN code" />
                <button className="btn btn-primary">Search Branches</button>
              </div>
              <div className="search-filters">
                <label>
                  <input type="checkbox" /> ATM Available
                </label>
                <label>
                  <input type="checkbox" /> Parking Available
                </label>
                <label>
                  <input type="checkbox" /> Weekend Service
                </label>
              </div>
            </div>
            
            <div className="featured-branches">
              <h3>Major Branch Locations</h3>
              <div className="branches-grid">
                <div className="branch-card">
                  <h4>Mumbai Central</h4>
                  <p>123 Dr. DN Road, Fort<br />Mumbai - 400001</p>
                  <span>📞 022-1234-5678</span>
                </div>
                <div className="branch-card">
                  <h4>Delhi Connaught Place</h4>
                  <p>45 Connaught Place<br />New Delhi - 110001</p>
                  <span>📞 011-1234-5678</span>
                </div>
                <div className="branch-card">
                  <h4>Bangalore Koramangala</h4>
                  <p>78 Koramangala 4th Block<br />Bangalore - 560034</p>
                  <span>📞 080-1234-5678</span>
                </div>
                <div className="branch-card">
                  <h4>Chennai T. Nagar</h4>
                  <p>56 Usman Road, T. Nagar<br />Chennai - 600017</p>
                  <span>📞 044-1234-5678</span>
                </div>
              </div>
            </div>
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
            <div className="faq-item">
              <h4>What documents do I need for a loan application?</h4>
              <p>Generally, you'll need identity proof, address proof, income proof, and bank statements. Specific requirements may vary based on the loan type.</p>
            </div>
            <div className="faq-item">
              <h4>How long does the loan approval process take?</h4>
              <p>Our quick approval process can get you approved within 24-48 hours for most loan types, subject to document verification.</p>
            </div>
            <div className="faq-item">
              <h4>Can I apply for a loan online?</h4>
              <p>Yes, you can apply for all our loan products online through our website or mobile app. The process is completely digital and secure.</p>
            </div>
            <div className="faq-item">
              <h4>What is the minimum credit score required?</h4>
              <p>We typically require a credit score of 650 and above, but we evaluate applications holistically considering various factors.</p>
            </div>
            <div className="faq-item">
              <h4>Are there any prepayment charges?</h4>
              <p>Prepayment charges vary by loan type. Many of our loan products have zero prepayment charges. Please check specific terms for your loan.</p>
            </div>
            <div className="faq-item">
              <h4>How can I track my loan application status?</h4>
              <p>You can track your application status online through our customer portal, mobile app, or by calling our customer service team.</p>
            </div>
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