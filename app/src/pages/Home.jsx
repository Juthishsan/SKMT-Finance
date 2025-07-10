import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Slideshow from '../components/Slideshow';
import image1 from '../assets/image 11.jpg'
import image2 from '../assets/image 4.jpg'
import image3 from '../assets/image 6.jpg'
import image4 from '../assets/image 8.jpg'
import image5 from '../assets/image 12.jpg'
import image6 from '../assets/image 10.jpg'
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentHero, setCurrentHero] = useState(0);

  const heroSlides = [
    {
      heading: 'Drive Your Dreams with Our Car Loans',
      paragraph: 'Get behind the wheel of your dream car with flexible car loan options, low interest rates, and quick approvals. Experience hassle-free financing for new and used cars at SKMT Finance.'
    },
    {
      heading: 'Personal Loans for Every Need',
      paragraph: 'Whether it\'s a wedding, travel, education, or emergency, our personal loans offer fast disbursal, minimal paperwork, and competitive rates. Fulfill your aspirations with SKMT Finance.'
    },
    {
      heading: 'Make Your Dream Home a Reality',
      paragraph: 'Our home loans come with attractive interest rates, easy EMIs, and expert guidance. Turn your dream of owning a home into reality with SKMT Finance.'
    },
    {
      heading: 'Unlock the Value of Your Property',
      paragraph: 'Leverage your residential or commercial property for a high-value loan. Enjoy long tenure, low rates, and multi-purpose usage with SKMT Finance property loans.'
    },
    {
      heading: 'Bike Loans for Every Rider',
      paragraph: 'Finance your new or used bike with SKMT Finance. Enjoy quick approvals, low EMIs, and flexible repayment options for all types of two-wheelers.'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sync hero text with slideshow (assuming Slideshow exposes a callback or you can control the index)
  // For this example, we'll auto-cycle every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <Slideshow currentIndex={currentHero} />
        {/* Gradient overlay for blend effect */}
        <div className="hero-gradient-overlay" />
        <div className="hero-text-overlay">
          <div>
            <h1 className="hero-title">{heroSlides[currentHero].heading}</h1>
            <p className="hero-subtitle">{heroSlides[currentHero].paragraph}</p>
            <Link to="/loans" className="btn btn-primary hero-cta-btn">Explore Loans</Link>
          </div>
        </div>
      </section>

      {/* Loans Section */}
      <section className="section section-bg-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Our Popular Loans</h2>
            <p>Discover our range of loan products designed to meet your diverse needs</p>
          </div>
          <div className="grid grid-2">
            {[
              { img: image1, alt: 'Old Bike Loan', title: 'Old Bike Loan', desc: 'For customers looking to buy a reliable pre-owned two-wheeler, with fast approval, low EMIs, and minimal paperwork. Ideal for daily commuters and first-time buyers.', link: '/loans/1' },
              { img: image3, alt: 'Old Commercial Vehicle Loan', title: 'Old Commercial Vehicle Loan', desc: 'Expand your business fleet with easy loans for pre-owned commercial vehicles. Get high LTV, flexible repayment, and support for all vehicle types.', link: '/loans/3' },
              { img: image4, alt: 'Old Cars Loan', title: 'Old Cars Loan', desc: 'Buy a quality pre-owned car with affordable EMIs, fast approval, and transparent process. Suitable for families and professionals.', link: '/loans/4' },
            ].map((card, idx) => (
              <motion.div
                className="product-card"
                key={card.title}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <img src={card.img} alt={card.alt} />
                <div className="product-content">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <Link to={card.link} className="btn btn-primary">Learn More</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Available Products</h2>
            <p>Browse through our collection of quality products available for purchase</p>
          </div>
          
          {loading && (
            <div className="text-center">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="error-text">Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary error-btn"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center">
              <p className="no-products-text">No products available at the moment.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-3 products-grid">
              {products.filter(product => product.stock).slice(0, 3).map((product, idx) => (
                <motion.div
                  key={product._id}
                  className="card product-item"
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="product-image-container">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={`${API_URL}${product.images[0]}`} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        No Image
                      </div>
                    )}
                    <div className={`product-stock-badge${!product.stock ? ' out-of-stock' : ''}`}>
                      {product.stock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <div className="product-content">
                    <h3 className="product-name">
                      {product.name}
                    </h3>
                    
                    <p className="product-description">
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="product-price">
                        {formatPrice(product.price)}
                    </div>
                    
                    <div className="product-tags">
                      {product.type && (
                        <span className="product-tag type">
                          {product.type}
                        </span>
                      )}
                      {product.modelYear && (
                        <span className="product-tag year">
                          {product.modelYear}
                        </span>
                      )}
                      {product.owners && (
                        <span className="product-tag owners">
                          {product.owners} Owner{product.owners > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      to={`/products/${product._id}`} 
                      className="btn btn-primary product-view-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && !error && products.length > 0 && (
            <div className="view-all-products">
              <Link to="/products" className="btn btn-primary view-all-btn">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-primary">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: '1000+', label: 'Happy Customers' },
              { value: '₹1 Cr+', label: 'Loans Disbursed' },
              { value: '3+', label: 'Branches' },
              { value: '10+ Years', label: 'Industry Experience' },
            ].map((stat, idx) => (
              <motion.div
                className="stat-item text-center"
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Why Choose SKMT finance?</h2>
            <p>We offer comprehensive loan solutions tailored to your unique needs</p>
          </div>
          <div className="grid grid-3">
            {[
              { icon: '🚗', title: 'Vehicle Loans', desc: 'Get the best deals on vehicle loans with competitive interest rates and flexible repayment options.' },
              { icon: '🏠', title: 'Property Loans', desc: 'Make your dream property a reality with our attractive property loan packages and quick approval process.' },
              { icon: '💼', title: 'Business Loans', desc: 'Fuel your business growth with our comprehensive business loan solutions and expert guidance.' },
              { icon: '💰', title: 'Personal Loans', desc: 'Meet your personal financial needs with our hassle-free personal loan products and instant approvals.' },
              { icon: '🛡️', title: 'Insurance', desc: 'Protect what matters most with our comprehensive insurance solutions for you and your family.' },
              { icon: '📊', title: 'Investment Planning', desc: 'Build wealth for the future with our expert investment advisory and portfolio management services.' },
            ].map((feature, idx) => (
              <motion.div
                className="card feature-card"
                key={feature.title}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.05, delay: idx * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2>What Our Customers Say</h2>
            <p>Read testimonials from our satisfied customers across India</p>
          </div>
          <div className="grid grid-3">
            <div className="card testimonial-card">
              <div className="testimonial-content">
                <p>"Excellent service and quick loan approval. The team was very helpful throughout the process. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Customer" />
                <div>
                  <h4>Rajesh Kumar</h4>
                  <span>Mumbai, Maharashtra</span>
                </div>
              </div>
            </div>
            <div className="card testimonial-card">
              <div className="testimonial-content">
                <p>"Got my home loan approved within 48 hours. The interest rates are very competitive. Great experience overall!"</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Customer" />
                <div>
                  <h4>Priya Sharma</h4>
                  <span>Delhi, NCR</span>
                </div>
              </div>
            </div>
            <div className="card testimonial-card">
              <div className="testimonial-content">
                <p>"Professional staff and transparent process. They helped me understand all the terms clearly. Very satisfied!"</p>
              </div>
              <div className="testimonial-author">
                <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Customer" />
                <div>
                  <h4>Arun Patel</h4>
                  <span>Ahmedabad, Gujarat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="section section-bg-light">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Get Started?</h2>
            <p>Take the first step towards achieving your financial goals with SKMT finance</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">Apply Now</Link>
              <Link to="/services" className="btn btn-secondary">Calculate EMI</Link>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;



