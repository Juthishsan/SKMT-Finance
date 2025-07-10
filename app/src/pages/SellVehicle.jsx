import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const initialState = {
  brand: '',
  year: '',
  fuel: '',
  transmission: '',
  kmDriven: '',
  owners: '',
  title: '',
  description: '',
  price: '',
  images: []
};

const fuelOptions = ['Petrol', 'Diesel', 'CNG & Hybrids', 'Electric', 'LPG'];
const transmissionOptions = ['Manual', 'Automatic'];
const ownerOptions = ['1st', '2nd', '3rd', '4th', '4+'];

const SellVehicle = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm({ ...form, images: files });
      // Generate previews
      if (files && files.length > 0) {
        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
      } else {
        setImagePreviews([]);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');
    if (!user || !user._id) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'You must be logged in to submit a vehicle.',
        confirmButtonColor: '#dc2626'
      });
      setSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('user', user._id);
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          for (let i = 0; i < value.length; i++) {
            formData.append('images', value[i]);
          }
        } else {
          formData.append(key, value);
        }
      });
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(`${API_URL}/api/vehicle-sales`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to submit');
      Swal.fire({
        icon: 'success',
        title: 'Submission Successful!',
        text: 'Your vehicle sale submission has been received! Our team will contact you soon.',
        confirmButtonColor: '#1e3a8a'
      });
      setForm(initialState);
      setImagePreviews([]);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#dc2626'
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="sell-vehicle-page" style={{ background: 'linear-gradient(120deg, #f1f5f9 60%, #e0e7ef 100%)', minHeight: '100vh' }}>
      {/* <section className="page-hero">
        <div className="container">
          <div className="text-center">
            <h1>Sell Your Vehicle</h1>
            <p style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>Fill out the details below to list your vehicle for sale. Our team will review your submission.</p>
          </div>
        </div>
      </section> */}
      <section className="section">
        <div className="container" style={{ maxWidth: 750, margin: '0 auto' }}>
          <motion.div
            style={{ borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.13)', background: '#fff', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.45, duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', padding: '28px 0 18px 0', textAlign: 'center' }}>
              <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0, fontSize: 26 }}>Vehicle Sale Form</h2>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} encType="multipart/form-data" style={{ padding: 36 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div className="form-row" style={{ display: 'flex', gap: 18 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Brand *</label>
                    <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Maruti, Hyundai" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Year *</label>
                    <input name="year" value={form.year} onChange={handleChange} required placeholder="e.g. 2020" type="number" min="1900" max={new Date().getFullYear()} style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'} />
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 18 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Fuel *</label>
                    <select name="fuel" value={form.fuel} onChange={handleChange} required style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}>
                      <option value="">Select Fuel Type</option>
                      {fuelOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Transmission *</label>
                    <select name="transmission" value={form.transmission} onChange={handleChange} required style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}>
                      <option value="">Select Transmission</option>
                      {transmissionOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 18 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>KM Driven *</label>
                    <input name="kmDriven" value={form.kmDriven} onChange={handleChange} required placeholder="e.g. 35000" type="number" min="0" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>No. of Owners *</label>
                    <select name="owners" value={form.owners} onChange={handleChange} required style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}>
                      <option value="">Select Number of Owners</option>
                      {ownerOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: 18 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Ad Title *</label>
                    <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. 2018 Maruti Swift VXI, Single Owner" maxLength={70} style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Price *</label>
                    <input name="price" value={form.price} onChange={handleChange} required placeholder="e.g. 350000" type="number" min="0" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Include condition, features, and reason for selling" maxLength={4096} style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'} />
                </div>
                <div className="form-group">
                  <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Upload Photos (up to 10)</label>
                  <input name="images" type="file" accept="image/*" multiple onChange={handleChange} style={{ borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '10px', background: '#f8fafc', marginTop: 4 }} />
                  {imagePreviews.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14, background: '#f1f5f9', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: 12 }}>
                      {imagePreviews.map((src, idx) => (
                        <img key={idx} src={src} alt={`preview-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e0e7ef', boxShadow: '0 2px 8px #1e3a8a11' }} />
                      ))}
                    </div>
                  )}
                </div>
                <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', fontWeight: 700, fontSize: 20, borderRadius: 14, padding: '14px 0', marginTop: 10, boxShadow: '0 4px 16px #1e3a8a22', border: 'none', transition: 'background 0.18s, box-shadow 0.18s', cursor: submitting ? 'not-allowed' : 'pointer' }} onMouseOver={e => e.currentTarget.style.background='linear-gradient(90deg, #3b82f6 60%, #1e3a8a 100%)'} onMouseOut={e => e.currentTarget.style.background='linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)'}>{submitting ? 'Submitting...' : 'Submit Vehicle'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SellVehicle; 