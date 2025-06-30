import React, { useState } from 'react';

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
      setError('You must be logged in to submit a vehicle.');
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
      const res = await fetch('http://localhost:5000/api/vehicle-sales', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to submit');
      setSuccess('Vehicle submitted for sale! Our team will review and contact you.');
      setForm(initialState);
      setImagePreviews([]);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="sell-vehicle-page">
      <section className="contact-hero">
        <div className="container">
          <div className="text-center">
            <h1>Sell Your Vehicle</h1>
            <p>Fill out the details below to list your vehicle for sale. Our team will review your submission.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <form className="contact-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-row">
              <div className="form-group">
                <label>Brand *</label>
                <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Maruti, Hyundai" />
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input name="year" value={form.year} onChange={handleChange} required placeholder="e.g. 2020" type="number" min="1900" max={new Date().getFullYear()} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fuel *</label>
                <select name="fuel" value={form.fuel} onChange={handleChange} required>
                  <option value="">Select Fuel Type</option>
                  {fuelOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Transmission *</label>
                <select name="transmission" value={form.transmission} onChange={handleChange} required>
                  <option value="">Select Transmission</option>
                  {transmissionOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>KM Driven *</label>
                <input name="kmDriven" value={form.kmDriven} onChange={handleChange} required placeholder="e.g. 35000" type="number" min="0" />
              </div>
              <div className="form-group">
                <label>No. of Owners *</label>
                <select name="owners" value={form.owners} onChange={handleChange} required>
                  <option value="">Select Number of Owners</option>
                  {ownerOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ad Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. 2018 Maruti Swift VXI, Single Owner" maxLength={70} />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input name="price" value={form.price} onChange={handleChange} required placeholder="e.g. 350000" type="number" min="0" />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Include condition, features, and reason for selling" maxLength={4096} />
            </div>
            <div className="form-group">
              <label>Upload Photos (up to 10)</label>
              <input name="images" type="file" accept="image/*" multiple onChange={handleChange} />
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  ))}
                </div>
              )}
            </div>
            {success && <div style={{ color: '#10b981', marginBottom: 12, fontWeight: 600 }}>{success}</div>}
            {error && <div style={{ color: '#dc2626', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Vehicle'}</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SellVehicle; 