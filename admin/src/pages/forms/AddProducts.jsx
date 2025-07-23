import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useAuth } from '../../AuthProvider';
import LoadingSpinner from '../../components/LoadingSpinner';

const initialState = {
  name: '',
  price: '',
  stock: '',
  type: '',
  newType: '',
  modelYear: '',
  owners: '',
  fc: '',
  fcDuration: '',
  fcUnit: 'year',
  insurance: '',
  insuranceDuration: '',
  insuranceUnit: 'year',
  description: '',
  images: [],
};

const fcUnitOptions = ['year', 'month'];
const insuranceUnitOptions = ['year', 'month'];

const AddProducts = ({ setaddproduct, getproducts, productTypes }) => {
  const { authFetch } = useAuth();
  const [form, setForm] = useState(initialState);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showFcDuration, setShowFcDuration] = useState(false);
  const [showInsuranceDuration, setShowInsuranceDuration] = useState(false);
  const [isNewProductType, setIsNewProductType] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm({ ...form, images: files });
      if (files && files.length > 0) {
        const previews = Array.from(files).map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
      } else {
        setImagePreviews([]);
      }
    } else if (name === 'fc') {
      setForm({ ...form, fc: value });
      setShowFcDuration(value === 'true');
      if (value !== 'true') {
        setForm((f) => ({ ...f, fcDuration: '', fcUnit: 'year' }));
      }
    } else if (name === 'insurance') {
      setForm({ ...form, insurance: value });
      setShowInsuranceDuration(value === 'true');
      if (value !== 'true') {
        setForm((f) => ({ ...f, insuranceDuration: '', insuranceUnit: 'year' }));
      }
    } else if (name === 'type') {
      if (value === 'new') {
        setIsNewProductType(true);
        setForm({ ...form, type: '', newType: '' });
      } else {
        setIsNewProductType(false);
        setForm({ ...form, type: value, newType: '' });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('stock', form.stock === 'true');
    formData.append('type', isNewProductType ? form.newType : form.type);
    formData.append('modelYear', form.modelYear);
    formData.append('owners', form.owners);
    formData.append('fc', form.fc);
    if (form.fc === 'true') {
      formData.append('fcDuration', form.fcDuration);
      formData.append('fcUnit', form.fcUnit);
    }
    formData.append('insurance', form.insurance);
    if (form.insurance === 'true') {
      formData.append('insuranceDuration', form.insuranceDuration);
      formData.append('insuranceUnit', form.insuranceUnit);
    }
    formData.append('description', form.description);
    if (form.images && form.images.length > 0) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append('images', form.images[i]);
      }
    }
    try {
      const response = await authFetch(`${process.env.REACT_APP_API_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });
      setLoading(false);
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Product added successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        setaddproduct(false);
        getproducts();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add product',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (loading) return <LoadingSpinner fullscreen text="Adding Product..." />;

  // Only render the form fields and submit button
  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      style={{ padding: 0 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Row 1: Product Name, Product Stock */}
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Product Name"
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Stock *</label>
            <select
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        {/* Row 2: Product Price, Product Type */}
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Price *</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="Product Price"
              type="number"
              min="0"
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Type *</label>
            {!isNewProductType ? (
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              >
                <option value="">Select Type</option>
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
                <option value="new">New Type</option>
              </select>
            ) : (
              <input
                name="newType"
                value={form.newType}
                onChange={handleChange}
                required
                placeholder="New Product Type"
                style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
              />
            )}
          </div>
        </div>
        {/* Row 3: Model Year, No. of Owners */}
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Model Year *</label>
            <input
              name="modelYear"
              value={form.modelYear}
              onChange={handleChange}
              required
              placeholder="Model Year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>No. of Owners *</label>
            <input
              name="owners"
              value={form.owners}
              onChange={handleChange}
              required
              placeholder="No. of Owners"
              type="number"
              min="1"
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            />
          </div>
        </div>
        {/* Row 4: FC, Insurance */}
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>FC *</label>
            <select
              name="fc"
              value={form.fc}
              onChange={handleChange}
              required
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {showFcDuration && (
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <input
                  name="fcDuration"
                  value={form.fcDuration}
                  onChange={handleChange}
                  required={form.fc === 'true'}
                  placeholder="No. of Years/Months"
                  type="number"
                  min="1"
                  style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                  onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                  onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                />
                <select
                  name="fcUnit"
                  value={form.fcUnit}
                  onChange={handleChange}
                  style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                >
                  {fcUnitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Insurance *</label>
            <select
              name="insurance"
              value={form.insurance}
              onChange={handleChange}
              required
              style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
              onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
              onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {showInsuranceDuration && (
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <input
                  name="insuranceDuration"
                  value={form.insuranceDuration}
                  onChange={handleChange}
                  required={form.insurance === 'true'}
                  placeholder="No. of Years/Months"
                  type="number"
                  min="1"
                  style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                  onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                  onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                />
                <select
                  name="insuranceUnit"
                  value={form.insuranceUnit}
                  onChange={handleChange}
                  style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                >
                  {insuranceUnitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        {/* Row 5: Product Images (full width) */}
        <div className="form-group">
          <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Images</label>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            style={{ borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '10px', background: '#f8fafc', marginTop: 4 }}
          />
          {imagePreviews.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 14,
                background: '#f1f5f9',
                borderRadius: 12,
                border: '1.5px solid #c7d2fe',
                padding: 12,
              }}
            >
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1.5px solid #e0e7ef',
                    boxShadow: '0 2px 8px #1e3a8a11',
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Row 6: Product Description (full width) */}
        <div className="form-group">
          <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Product Description"
            maxLength={4096}
            style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
            onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
            onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            borderRadius: 14,
            padding: '14px 0',
            marginTop: 10,
            boxShadow: '0 4px 16px #1e3a8a22',
            border: 'none',
            transition: 'background 0.18s, box-shadow 0.18s',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #3b82f6 60%, #1e3a8a 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)'}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default AddProducts;
