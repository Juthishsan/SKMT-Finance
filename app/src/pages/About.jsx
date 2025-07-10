import React from 'react';
import manikkamPhoto from '../assets/manikkam photo.jpg';
import midhunPhoto from '../assets/midhun photo 3.jpg';
import thiruPhoto from '../assets/thiru photo 3.jpg';
import AboutSlideshow from '../components/AboutSlideshow';
import logo from '../assets/skmt logo (1).png';
import { motion } from 'framer-motion';

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
            {[
              {
                name: 'Manickavasakan',
                role: 'Chief Executive Officer',
                img: manikkamPhoto,
                desc: 'With over 10 years of experience in financial services, Manickavasakan leads our strategic vision and growth initiatives.'
              },
              {
                name: 'Midhun Pravesh',
                role: 'Chief Technology Officer',
                img: midhunPhoto,
                desc: 'Midhun drives our digital transformation initiatives and technology innovation across all platforms.'
              },
              {
                name: 'Thiru',
                role: 'Chief Financial Officer',
                img: thiruPhoto,
                desc: 'Thiru oversees financial operations and risk management with his extensive expertise in corporate finance.'
              }
            ].map((leader, idx) => (
              <motion.div
                className="leader-card"
                key={leader.name}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="leader-image">
                  <img src={leader.img} alt={leader.role} />
                </div>
                <div className="leader-info">
                  <h4>{leader.name}</h4>
                  <span className="leader-role">{leader.role}</span>
                  <p>{leader.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Mission Vision Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            {[
              {
                icon: '🎯',
                title: 'Our Mission',
                desc: 'To provide accessible, innovative, and customer-centric financial solutions that empower individuals and businesses to achieve their dreams and aspirations while maintaining the highest standards of integrity and transparency.'
              },
              {
                icon: '👁️',
                title: 'Our Vision',
                desc: `To be India's most trusted and preferred financial services partner, recognized for our commitment to customer satisfaction, technological innovation, and sustainable growth across all communities we serve.`
              }
            ].map((card, idx) => (
              <motion.div
                className="mission-card"
                key={card.title}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Company Story */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="story-section">
            <motion.div
              className="story-content"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', duration: 0.05, delay: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2>Our Journey</h2>
              <p>Founded in 2010, SKMT finance has grown from a small financial services company to one of top financial company. Our journey has been marked by continuous innovation, customer-first approach, and unwavering commitment to excellence.</p>

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
            </motion.div>

            <motion.div
              className="story-image"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', duration: 0.05, delay: 0.07 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img src={logo} alt="Our Journey" />
            </motion.div>
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
            {[
              { icon: '🤝', title: 'Trust', desc: 'Building lasting relationships through transparency, honesty, and reliability in all our interactions' },
              { icon: '🎯', title: 'Excellence', desc: 'Delivering superior quality in every product and service we offer to our customers' },
              { icon: '💖', title: 'Customer First', desc: 'Putting our customers at the heart of everything we do, understanding their needs and exceeding expectations' },
            ].map((value, idx) => (
              <motion.div
                className="value-card"
                key={value.title}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </motion.div>
            ))}
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