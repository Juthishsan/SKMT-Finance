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
        const res = await axios.get('http://localhost:5000/api/products');
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
      <section className="products-hero">
        <div className="container">
          <div className="text-center">
            <h1>Automobiles for Sale</h1>
            <p>Find the best deals on cars, bikes, scooters, and other vehicles. All listings are verified and ready for you to buy!</p>
          </div>
        </div>
      </section>

      {/* Filter Button Group */}
      <div className="container" style={{ marginTop: 32, marginBottom: 32 }}>
        <div className="product-type-btn-group" style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
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
              <div className="loading-spinner" style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #1e3a8a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '20px', color: '#666' }}>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p style={{ color: '#dc3545', fontSize: '1.1rem' }}>Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filterProducts().length === 0 && (
            <div className="text-center">
              <p style={{ color: '#666', fontSize: '1.1rem' }}>No products available at the moment.</p>
            </div>
          )}

          {!loading && !error && filterProducts().length > 0 && (
            <div className="grid grid-3" style={{ gap: '2rem' }}>
              {filterProducts().map((product) => (
                <div key={product._id} className="card product-item" style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={`http://localhost:5000${product.images[0]}`} 
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d'
                      }}>
                        No Image
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: product.stock ? '#28a745' : '#dc3545',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {product.stock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '1.2rem', 
                      color: '#1e3a8a',
                      fontWeight: '600'
                    }}>
                      {product.name}
                    </h3>
                    
                    <p style={{ 
                      margin: '0 0 1rem 0', 
                      color: '#666', 
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      textTransform: 'capitalize'
                    }}>
                      {product.description || 'No description available'}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ 
                        fontSize: '1.3rem', 
                        fontWeight: 'bold', 
                        color: '#1e3a8a'
                      }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem', 
                      marginBottom: '1rem',
                      fontSize: '0.8rem'
                    }}>
                      {product.type && (
                        <span style={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          {product.type}
                        </span>
                      )}
                      {product.modelYear && (
                        <span style={{
                          background: '#f3e5f5',
                          color: '#7b1fa2',
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          {product.modelYear}
                        </span>
                      )}
                      {product.owners && (
                        <span style={{
                          background: '#e8f5e8',
                          color: '#388e3c',
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          {product.owners} Owner{product.owners > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      to={`/products/${product._id}`} 
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '0.75rem',
                        fontSize: '0.9rem'
                      }}
                      onClick={e => e.stopPropagation()}
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