import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filterProducts = () => {
    if (selectedType === 'All') return products;
    if (selectedType === 'Car') return products.filter(p => p.type === 'Car');
    if (selectedType === 'Dost Van') return products.filter(p => p.type === 'Dost Van');
    if (selectedType === 'Bike') return products.filter(p => p.type === 'Bike' || p.type === 'Scooter');
    if (selectedType === 'Other') return products.filter(p => p.type === 'Other');
    return products;
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
            <p>Find the best deals on cars, bikes, scooters, and other vehicles. All listings are verified and ready for you to buy!</p>
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
          <button
            className={`btn ${selectedType === 'Car' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedType('Car')}
          >
            Car
          </button>
          <button
            className={`btn ${selectedType === 'Dost Van' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedType('Dost Van')}
          >
            Commercial Vehicle
          </button>
          <button
            className={`btn ${selectedType === 'Bike' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedType('Bike')}
          >
            Bike
          </button>
          <button
            className={`btn ${selectedType === 'Other' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedType('Other')}
          >
            Other
          </button>
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
              {filterProducts().map((product) => (
                <div key={product._id} className="card product-item">
                  <div className="product-image-container">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL}${product.images[0]}`} 
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
                    
                    <p className="product-description" style={{ textTransform: 'capitalize' }}>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;