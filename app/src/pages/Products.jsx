import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        const products = Array.isArray(res.data.data) ? res.data.data : [];
        setProducts(products);
        // Extract unique product types
        const types = [...new Set(products.map(product => product.type).filter(type => type))];
        setProductTypes(types);
      } catch (err) {
        setError('Failed to fetch products');
        setProducts([]);
        setProductTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filterProducts = () => {
    if (selectedType === 'All') return products;
    return products.filter(p => p.type === selectedType);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="products">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <div className="text-center">
            <h1>Automobiles for Sale</h1>
            <p>Find the best deals on all automobiles. All listings are verified and ready for you to buy!</p>
          </div>
        </div>
      </section>

      {/* Filter Button Group */}
      <div className="container">
        <div className="product-type-btn-group">
          <button
            className={`btn ${selectedType === 'All' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedType('All')}
          >
            All
          </button>
          {productTypes.map(type => (
            <button
              key={type}
              className={`btn ${selectedType === type ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
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

          {!loading && !error && filterProducts().length === 0 && (
            <div className="text-center">
              <p className="no-products-text">No products available at the moment.</p>
            </div>
          )}

          {!loading && !error && filterProducts().length > 0 && (
            <div className="grid grid-3 products-grid">
              {filterProducts().map((product, idx) => (
                <motion.div
                  key={product._id}
                  className="card product-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${product._id}`)}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', duration: 0.05, delay: idx * 0.05 }}
                >
                  <div className="product-image-container">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={
                          product.images[0]
                            ? product.images[0].startsWith('http')
                              ? product.images[0]
                              : `${API_URL}${product.images[0]}`
                            : ''
                        }
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
                    
                    {/* <p className="product-description" style={{ textTransform: 'capitalize' }}>
                      {product.description || 'No description available'}
                    </p> */}
                    
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
                      onClick={e => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;