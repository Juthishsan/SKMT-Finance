import React from 'react';
import manikkamPhoto from '../assets/manikkam photo.jpg';
import midhunPhoto from '../assets/midhun photo 3.jpg';
import thiruPhoto from '../assets/thiru photo 3.jpg';
import AboutSlideshow from '../components/AboutSlideshow';

const About = () => {
  return (
    <div className="about">

      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <div className="text-center">
            <h1>About SKMT Finance</h1>
            <p>Empowering dreams and transforming lives through innovative financial solutions.</p>
          </div>
        </div>
      </section>

      {/* about Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>About SKMT finance</h1>
              <p>Empowering dreams and transforming lives through innovative financial solutions. We are committed to making financial services accessible, transparent, and customer-centric.</p>
            </div>
            <div className="hero-image">
              <AboutSlideshow />
            </div>
          </div>
        </div>
      </section>


      {/* Leadership Team */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Leadership Team</h2>
            <p>Meet the experienced professionals leading SKMT finance towards continued success</p>
          </div>
          <div className="grid grid-3">
            <div className="leader-card">
              <div className="leader-image">
                <img src={manikkamPhoto} alt="CEO" />
              </div>
              <div className="leader-info">
                <h4>Manickavasakan</h4>
                <span className="leader-role">Chief Executive Officer</span>
                <p>With over 10 years of experience in financial services, Manickavasakan leads our strategic vision and growth initiatives.</p>
              </div>
            </div>


            <div className="leader-card">
              <div className="leader-image">
                <img src={midhunPhoto} alt="CTO" />
              </div>
              <div className="leader-info">
                <h4>Midhun Pravesh</h4>
                <span className="leader-role">Chief Technology Officer</span>
                <p>Midhun drives our digital transformation initiatives and technology innovation across all platforms.</p>
              </div>
            </div>


            <div className="leader-card">
              <div className="leader-image">
                <img src={thiruPhoto} alt="CFO" />
              </div>
              <div className="leader-info">
                <h4>Thiru</h4>
                <span className="leader-role">Chief Financial Officer</span>
                <p>Thiru oversees financial operations and risk management with his extensive expertise in corporate finance.</p>
              </div>
            </div>


          </div>
        </div>
      </section>



      {/* Mission Vision Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To provide accessible, innovative, and customer-centric financial solutions that empower individuals and businesses to achieve their dreams and aspirations while maintaining the highest standards of integrity and transparency.</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To be India's most trusted and preferred financial services partner, recognized for our commitment to customer satisfaction, technological innovation, and sustainable growth across all communities we serve.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Company Story */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="story-section">
            <div className="story-content">
              <h2>Our Journey</h2>
              <p>Founded in 1999, SKMT finance has grown from a small financial services company to one of India's leading non-banking financial companies (NBFCs). Our journey has been marked by continuous innovation, customer-first approach, and unwavering commitment to excellence.</p>

              {/* <div className="milestones">
                <div className="milestone">
                  <div className="milestone-year">1999</div>
                  <div className="milestone-content">
                    <h4>Foundation</h4>
                    <p>Started operations with a vision to democratize financial services</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2005</div>
                  <div className="milestone-content">
                    <h4>Expansion</h4>
                    <p>Expanded to 500+ branches across 15 states</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2010</div>
                  <div className="milestone-content">
                    <h4>Digital Transformation</h4>
                    <p>Launched digital services and mobile banking platform</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2015</div>
                  <div className="milestone-content">
                    <h4>Market Leadership</h4>
                    <p>Became one of the top 5 NBFCs in India</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2020</div>
                  <div className="milestone-content">
                    <h4>Innovation</h4>
                    <p>Introduced AI-powered lending and instant approval systems</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2024</div>
                  <div className="milestone-content">
                    <h4>Present Day</h4>
                    <p>Serving 10M+ customers with 2,500+ branches nationwide</p>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="story-image">
              <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Our Journey" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Our Core Values</h2>
            <p>The principles that guide every decision we make and every service we provide</p>
          </div>
          <div className="grid grid-4">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Trust</h4>
              <p>Building lasting relationships through transparency, honesty, and reliability in all our interactions</p>
            </div>
            {/* <div className="value-card">
              <div className="value-icon">⚡</div>
              <h4>Innovation</h4>
              <p>Continuously evolving our services through cutting-edge technology and creative solutions</p>
            </div> */}
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h4>Excellence</h4>
              <p>Delivering superior quality in every product and service we offer to our customers</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💖</div>
              <h4>Customer First</h4>
              <p>Putting our customers at the heart of everything we do, understanding their needs and exceeding expectations</p>
            </div>
          </div>
        </div>
      </section>



      {/* Awards and Recognition */}
      {/* <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Awards & Recognition</h2>
            <p>Our commitment to excellence has been recognized by industry leaders and customers alike</p>
          </div>
          <div className="grid grid-2">
            <div className="award-category">
              <h3>Industry Awards</h3>
              <div className="awards-list">
                <div className="award-item">
                  <div className="award-year">2023</div>
                  <div className="award-details">
                    <h4>Best NBFC of the Year</h4>
                    <span>Financial Express Awards</span>
                  </div>
                </div>
                <div className="award-item">
                  <div className="award-year">2022</div>
                  <div className="award-details">
                    <h4>Excellence in Digital Banking</h4>
                    <span>Banking Technology Awards</span>
                  </div>
                </div>
                <div className="award-item">
                  <div className="award-year">2021</div>
                  <div className="award-details">
                    <h4>Customer Service Excellence</h4>
                    <span>Indian Financial Services Awards</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="award-category">
              <h3>Customer Recognition</h3>
              <div className="awards-list">
                <div className="award-item">
                  <div className="award-year">2023</div>
                  <div className="award-details">
                    <h4>Most Trusted Brand</h4>
                    <span>Brand Trust Report</span>
                  </div>
                </div>
                <div className="award-item">
                  <div className="award-year">2022</div>
                  <div className="award-details">
                    <h4>Best Customer Experience</h4>
                    <span>Customer Satisfaction Survey</span>
                  </div>
                </div>
                <div className="award-item">
                  <div className="award-year">2021</div>
                  <div className="award-details">
                    <h4>Top Employer</h4>
                    <span>Great Place to Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="section bg-primary">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Join Our Journey</h2>
            <p>Be part of our mission to transform financial services in India</p>
            <div className="cta-buttons">
              <a href="#" className="btn btn-secondary">Career Opportunities</a>
              <a href="#" className="btn btn-outline" style={{color: 'white', borderColor: 'white'}}>Investor Relations</a>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default About;