import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  }, [id]);

  if (loading) {
    return <div className="container" style={{padding: '64px 0', textAlign: 'center'}}>Loading product...</div>;
  }

  if (!product) {
    return <div className="container" style={{padding: '64px 0', textAlign: 'center'}}>Product not found.</div>;
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(img => img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}${img}`)
    : ['/assets/default-car.jpg'];

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Place Order handler
  const handlePlaceOrder = async () => {
    if (!product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Out of stock',
        text: 'Sorry, this product is out of stock.',
        confirmButtonColor: '#dc3545',
      });
      return;
    }
    // Get user from localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch {}
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please log in to place an order.',
        confirmButtonColor: '#1e3a8a',
      });
      return;
    }
    // Fetch the full product object again to guarantee freshness
    let freshProduct = product;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      if (res.ok) {
        freshProduct = await res.json();
      }
    } catch {}
    const userSnapshot = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
    };
    // Use the freshly fetched product object
    const productSnapshot = { ...freshProduct };
    const orderData = {
      userSnapshot,
      productSnapshot,
    };
    console.log('Order data being sent:', orderData);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Order placed!',
          text: 'We will contact you soon.',
          confirmButtonColor: '#1e3a8a',
        });
      } else {
        const data = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Order failed',
          text: data.error || 'Could not place order.',
          confirmButtonColor: '#dc3545',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Order failed',
        text: err.message || 'Could not place order.',
        confirmButtonColor: '#dc3545',
      });
    }
  };

  return (
    <div className="container" style={{padding: '48px 0', maxWidth: 1200}}>
      <div style={{marginBottom: 32}}>
        <Link to="/products" className="btn btn-outline" style={{fontSize: 16}}>&larr; Back to Products</Link>
      </div>
      <div className="product-details-card" style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 32px rgba(30,58,138,0.10)',
        padding: 32,
        display: 'flex',
        gap: 48,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginBottom: 40
      }}>
        {/* Image Gallery */}
        <div style={{flex: '1 1 400px', minWidth: 320, maxWidth: 520}}>
          <div style={{position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f3f4f6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16}}>
            {images.length > 1 && (
              <button onClick={prevImage} style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 24, cursor: 'pointer', zIndex: 2}}>&lt;</button>
            )}
            <img src={images[current]} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: 16}} />
            {images.length > 1 && (
              <button onClick={nextImage} style={{position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 24, cursor: 'pointer', zIndex: 2}}>&gt;</button>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{display: 'flex', gap: 10, marginTop: 8, justifyContent: 'center'}}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  style={{
                    width: 56,
                    height: 42,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: idx === current ? '2px solid #1e3a8a' : '2px solid #eee',
                    cursor: 'pointer',
                    boxShadow: idx === current ? '0 2px 8px #1e3a8a22' : 'none',
                    transition: 'border 0.2s, box-shadow 0.2s'
                  }}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Details Section */}
        <div style={{flex: '2 1 340px', minWidth: 260}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8}}>
            <h1 style={{margin: 0, fontSize: '2.1rem', fontWeight: 700, color: '#1e3a8a'}}>{product.name}</h1>
            <span style={{
              background: product.stock ? '#28a745' : '#dc3545',
              color: 'white',
              padding: '4px 14px',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1rem',
              marginLeft: 8
            }}>{product.stock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 12}}>{formatPrice(product.price)}</div>
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18}}>
            {product.type && <span style={{background: '#e3f2fd', color: '#1976d2', padding: '2px 10px', borderRadius: '12px', fontSize: '0.95rem'}}>{product.type}</span>}
            {product.modelYear && <span style={{background: '#f3e5f5', color: '#7b1fa2', padding: '2px 10px', borderRadius: '12px', fontSize: '0.95rem'}}>{product.modelYear}</span>}
            {product.owners && <span style={{background: '#e8f5e8', color: '#388e3c', padding: '2px 10px', borderRadius: '12px', fontSize: '0.95rem'}}>{product.owners} Owner{product.owners > 1 ? 's' : ''}</span>}
            {product.fcYears && <span style={{background: '#fff3e0', color: '#ff9800', padding: '2px 10px', borderRadius: '12px', fontSize: '0.95rem'}}>{product.fcYears} FC Years</span>}
            {typeof product.insurance === 'boolean' && (
              <span style={{background: '#e1f5fe', color: '#0288d1', padding: '2px 10px', borderRadius: '12px', fontSize: '0.95rem'}}>{product.insurance ? 'Insured' : 'No Insurance'}</span>
            )}
          </div>
          <div style={{marginBottom: 18, color: '#444', fontSize: '1.08rem', lineHeight: 1.7, background: '#f8fafc', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #1e3a8a0a'}}>
            <strong>Description:</strong><br/>
            {product.description || 'No description available for this product.'}
          </div>
          {/* Highlights/Specs */}
          <div style={{marginBottom: 24}}>
            <h3 style={{fontSize: '1.1rem', color: '#1e3a8a', marginBottom: 8}}>Product Highlights</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, color: '#333', fontSize: '1rem', lineHeight: 1.7}}>
              <li><strong>Model Year:</strong> {product.modelYear || 'N/A'}</li>
              <li><strong>Type:</strong> {product.type || 'N/A'}</li>
              <li><strong>Owners:</strong> {product.owners || 'N/A'}</li>
              <li><strong>FC Years:</strong> {product.fcYears || 'N/A'}</li>
              <li><strong>Insurance:</strong> {typeof product.insurance === 'boolean' ? (product.insurance ? 'Yes' : 'No') : 'N/A'}</li>
              <li><strong>Status:</strong> {product.stock ? 'Available' : 'Out of Stock'}</li>
            </ul>
          </div>
          <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24}}>
            <button type="button" className="btn btn-primary" style={{fontSize: '1.1rem', minWidth: 160}} onClick={handlePlaceOrder}>Place Order</button>
            <a href={window.location.href} className="btn btn-outline" style={{fontSize: '1.1rem', minWidth: 120}} target="_blank" rel="noopener noreferrer">Share</a>
          </div>
          {/* Trust/Why Buy Section */}
          <div style={{background: '#f1f8e9', borderRadius: 10, padding: 16, marginBottom: 8, color: '#33691e', fontWeight: 500, fontSize: '1rem', boxShadow: '0 2px 8px #388e3c11'}}>
            <span role="img" aria-label="trust">✅</span> Why buy from us?
            <ul style={{margin: '8px 0 0 18px', padding: 0, color: '#33691e', fontWeight: 400, fontSize: '0.98rem'}}>
              <li>All vehicles are quality checked and verified</li>
              <li>Transparent pricing, no hidden charges</li>
              <li>Easy finance and loan options available</li>
              <li>Trusted by 1000+ happy customers</li>
              <li>After-sales support and guidance</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Similar Products Placeholder */}
      <div style={{marginTop: 40}}>
        <h2 style={{fontSize: '1.3rem', color: '#1e3a8a', marginBottom: 18}}>You may also like</h2>
        <div style={{background: '#f3f4f6', borderRadius: 12, padding: 32, textAlign: 'center', color: '#888', fontSize: '1.1rem'}}>
          More products coming soon...
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 