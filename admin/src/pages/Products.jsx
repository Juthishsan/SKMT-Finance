import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AddProducts from './forms/AddProducts';
import Swal from 'sweetalert2';
import { BsEyeFill, BsPencilFill, BsTrashFill } from 'react-icons/bs';

const Products = () => {
  const [addproduct, setaddproduct] = useState(false);
  const [editproduct, seteditproduct] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [editdata, seteditdata] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const uniqueProductTypes = [...new Set(tableData.map(product => product.type))];

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  

  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    if (editdata && editdata.imageURL) {
      setPreviewImage(editdata.imageURL);
    }
  }, [editdata]);


  useEffect(() => {
    // Check if notification needs to be sent when tableData changes
    if (tableData.length > 0 && !notificationSent) {
      checkAndSendNotification();
    }
  }, [tableData, notificationSent]);


  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const checkAndSendNotification = () => {
    // Removed firebase database related logic
  };

  const getproducts = () => {
    fetchProducts();
  };


  const handleEdit = (row) => {
    seteditproduct(true);
    seteditdata(row);
  };

  const handleDelete = (id) => {
    console.log('Delete clicked for', id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: `
            <div className="">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          `,
          showConfirmButton: false,
          background: 'transparent',
        });
        try {
          const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Product deleted successfully!',
              showConfirmButton: true,
              confirmButtonColor: 'black',
            });
            getproducts();
          } else {
            const errorData = await response.json();
            Swal.fire({
              icon: 'error',
              title: 'Failed to delete product',
              text: errorData.error || '',
              showConfirmButton: true,
              confirmButtonColor: 'black',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            showConfirmButton: true,
            confirmButtonColor: 'black',
          });
        }
      }
    });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();

    const { _id, newImage, ...updatedDetails } = editdata;

    try {
      const formData = new FormData();
      formData.append('name', updatedDetails.name);
      formData.append('price', updatedDetails.price);
      formData.append('stock', updatedDetails.stock === true);
      formData.append('type', updatedDetails.type);
      formData.append('description', updatedDetails.info || updatedDetails.description || '');
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await fetch(`http://localhost:5000/api/products/${_id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Product updated successfully!',
          showConfirmButton: true,
          confirmButtonColor: 'black',
        }).then(() => {
          seteditproduct(false);
        });
        getproducts();
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Failed to update product',
          text: errorData.error || '',
          showConfirmButton: true,
          confirmButtonColor: 'black',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        showConfirmButton: true,
        confirmButtonColor: 'black',
      });
    }
  };



  const handleStockUpdate = (key, newStock) => {
    // Convert newStock to a number
    const stockValue = parseInt(newStock);

    // Check if the stock value is less than 0
    if (stockValue < 0) {
      // Show a warning message
      Swal.fire('Warning', 'Stock value cannot be less than 0', 'warning');
    } else {
      // Proceed with updating the stock value if it's not less than 0
      // Removed firebase database related logic
    }
  };



  const columns = [
    {
      name: 'Images',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {(row.images || []).slice(0, 2).map((img, idx) => (
            <img
              key={idx}
              src={img ? `http://localhost:5000${img}` : ''}
              alt="Product"
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--border-gray)', background: '#fff' }}
              loading="lazy"
            />
          ))}
          {row.images && row.images.length > 2 && <span style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>+{row.images.length - 2}</span>}
        </div>
      ),
    },
    { name: 'Type', selector: 'type' },
    { name: 'Name', selector: 'name' },
    { name: 'Price', selector: (row) => `₹ ${row.price}`, sortable: true },
    { name: 'Stock', selector: 'stock' },
    { name: 'Model Year', selector: 'modelYear' },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex flex-row gap-2">
          <button
            className="btn btn-sm action-btn-view"
            style={{ background: 'none', color: '#2563eb', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
            onClick={() => openModal(row)}
            title="View"
          >
            <BsEyeFill size={20} />
          </button>
          <button
            className="btn btn-sm action-btn-edit"
            style={{ background: 'none', color: '#ea580c', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <BsPencilFill size={18} />
          </button>
          <button
            className="btn btn-sm action-btn-delete"
            style={{ background: 'none', color: '#dc2626', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
            onClick={() => handleDelete(row._id)}
            title="Delete"
          >
            <BsTrashFill size={18} />
          </button>
        </div>
      ),
    },
  ];

  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  };

  const handleSearch = (searchQuery, selectedType) => {
    let filteredItems = tableData;

    if (searchQuery) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filteredItems = filteredItems.filter((item) =>
        item.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredData(filteredItems);
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setSlideshowIndex(0);
    setModalOpen(true);
  };

  
  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Products</h2>
          </div>
          <div style={{ padding: 32 }}>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2 flex-wrap" style={{ flex: 1, minWidth: 260 }}>
                <select
                  value={selectedType}
                  onChange={e => {
                    setSelectedType(e.target.value);
                    handleSearch(searchText, e.target.value);
                  }}
                  className="form-select"
                  style={{ border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 15, minWidth: 120, maxWidth: 180 }}
                >
                  <option value="">All Types</option>
                  {uniqueProductTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="input-group" style={{ minWidth: 220, maxWidth: 320 }}>
                  <span className="input-group-text" style={{ background: '#f1f5f9', border: '1.5px solid #c7d2fe' }}><i className="bi bi-search" style={{ color: '#1e3a8a' }}></i></span>
                  <input
                    type="text"
                    placeholder="Search products by name"
                    className="form-control"
                    style={{ border: '1.5px solid #c7d2fe', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 16, padding: '10px 12px' }}
                    value={searchText}
                    onChange={e => {
                      setSearchText(e.target.value);
                      handleSearch(e.target.value, selectedType);
                    }}
                  />
                </div>
              </div>
              <button
                style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(30,58,138,0.08)', border: 'none', padding: '10px 28px', letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                onClick={() => setaddproduct(true)}
              >
                + Add Product
              </button>
            </div>
            <div className="table-responsive admins-table-responsive">
              <table className="table table-bordered table-striped" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 0 }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Image</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Name</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Type</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Price</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Stock</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Model Year</th>
                    <th style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchText || selectedType ? filteredData : tableData).map(product => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        {(product.images && product.images.length > 0) ? (
                          <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--border-gray)', background: '#fff' }} />
                        ) : (
                          <div style={{ color: '#aaa', fontSize: 22 }}>No Image</div>
                        )}
                      </td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{product.name}</td>
                      <td style={{ padding: 12 }}>{product.type}</td>
                      <td style={{ padding: 12, fontWeight: 700 }}>₹ {product.price}</td>
                      <td style={{ padding: 12 }}>{product.stock === true ? 'Yes' : 'No'}</td>
                      <td style={{ padding: 12 }}>{product.modelYear}</td>
                      <td style={{ padding: 12 }}>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm action-btn-view"
                            style={{ background: 'none', color: '#2563eb', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                            onClick={() => openModal(product)}
                            title="View"
                          >
                            <BsEyeFill size={20} />
                          </button>
                          <button
                            className="btn btn-sm action-btn-edit"
                            style={{ background: 'none', color: '#ea580c', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <BsPencilFill size={18} />
                          </button>
                          <button
                            className="btn btn-sm action-btn-delete"
                            style={{ background: 'none', color: '#dc2626', border: 'none', padding: 6, display: 'flex', alignItems: 'center' }}
                            onClick={() => handleDelete(product._id)}
                            title="Delete"
                          >
                            <BsTrashFill size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {addproduct && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Add New Product</span>
              <button type="button" onClick={() => setaddproduct(false)} className="admin-modal-close-btn" aria-label="Close" title="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div style={{ padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <AddProducts setaddproduct={setaddproduct} getproducts={getproducts} productTypes={uniqueProductTypes} />
            </div>
          </div>
        </div>
      )}
      {editproduct && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Edit Product</span>
              <button type="button" onClick={() => seteditproduct(false)} className="admin-modal-close-btn" aria-label="Close" title="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div style={{ padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <form onSubmit={handleEditSave} className="grid grid-2 gap-4 add-product-form">
                <div className="form-group full-width">
                  <label className="mb-2 fw-bold text-primary-blue">Product Image</label>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      seteditdata({ ...editdata, newImage: e.target.files[0] });
                      if (e.target.files && e.target.files[0]) {
                        let reader = new FileReader();
                        reader.onload = function (event) {
                          setPreviewImage(event.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className="input-field pt-2"
                    id="image"
                  />
                  {previewImage && (
                    <div className="image-preview-list">
                      <div className="image-preview-item">
                        <img src={previewImage} alt="Preview" className="image-preview-img" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">Product Name</label>
                  <input
                    type="text"
                    className="input-field"
                    id="name"
                    value={editdata.name}
                    onChange={(e) => seteditdata({ ...editdata, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">Product Type</label>
                  <input
                    className="input-field"
                    id="type"
                    value={editdata.type}
                    onChange={(e) => seteditdata({ ...editdata, type: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">Product Price</label>
                  <input
                    type="number"
                    className="input-field"
                    id="price"
                    value={editdata.price}
                    onChange={(e) => seteditdata({ ...editdata, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">Product Stock</label>
                  <select
                    className="input-field"
                    id="stock"
                    value={String(editdata.stock)}
                    onChange={e => seteditdata({ ...editdata, stock: e.target.value === 'true' })}
                    required
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">Model Year</label>
                  <input
                    type="number"
                    className="input-field"
                    id="modelYear"
                    value={editdata.modelYear || ''}
                    onChange={(e) => seteditdata({ ...editdata, modelYear: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">No. of Owners</label>
                  <input
                    type="number"
                    className="input-field"
                    id="owners"
                    value={editdata.owners || ''}
                    onChange={(e) => seteditdata({ ...editdata, owners: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">FC Years</label>
                  <input
                    type="number"
                    className="input-field"
                    id="fcYears"
                    value={editdata.fcYears || ''}
                    onChange={(e) => seteditdata({ ...editdata, fcYears: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="mb-2 fw-bold text-primary-blue">Insurance</label>
                  <select
                    className="input-field"
                    id="insurance"
                    value={editdata.insurance ? 'true' : 'false'}
                    onChange={(e) => seteditdata({ ...editdata, insurance: e.target.value === 'true' })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="mb-2 fw-bold text-primary-blue">Product Description</label>
                  <textarea
                    className="input-field pt-2"
                    id="info"
                    rows="4"
                    value={editdata.info || editdata.description || ''}
                    onChange={(e) => seteditdata({ ...editdata, info: e.target.value })}
                  />
                </div>
                <div className="col-md-12 mb-4 px-5 text-center full-width">
                  <button className="btn btn-primary add-product-submit-btn" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && selectedRowData && (
        <div className="admin-modal-bg">
          <div className="admin-modal admin-modal--wide" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(30,58,138,0.18)' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 0 18px 0', textAlign: 'center', position: 'relative' }}>
              <span className="admin-modal-title py-3" style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>Product Info</span>
              <button className="admin-modal-close-btn" onClick={() => setModalOpen(false)} title="Close" aria-label="Close" style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', transition: 'color 0.18s' }} onMouseOver={e => e.currentTarget.style.color='#ef4444'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                ×
              </button>
            </div>
            <div className="admin-modal-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, padding: '32px 24px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              <div style={{ flex: '0 0 340px', minWidth: 220, maxWidth: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {(selectedRowData.images || []).length > 0 ? (
                  <>
                    <img
                      className="admin-modal-image"
                      src={`http://localhost:5000${selectedRowData.images[slideshowIndex]}`}
                      loading="lazy"
                      alt={selectedRowData.name}
                      style={{ width: '100%', maxWidth: 300, height: 'auto', borderRadius: 18, boxShadow: '0 4px 24px #1e3a8a22', background: '#f1f5f9', objectFit: 'cover' }}
                    />
                    {selectedRowData.images.length > 1 && (
                      <>
                        <button
                          className="slideshow-arrow left"
                          style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,58,138,0.10)', transition: 'background 0.18s, color 0.18s', opacity: 0.95, outline: 'none' }}
                          onClick={() => setSlideshowIndex(prev => prev === 0 ? selectedRowData.images.length - 1 : prev - 1)}
                          aria-label="Previous image"
                          onMouseOver={e => e.currentTarget.style.background='#1e3a8a'}
                          onMouseOut={e => e.currentTarget.style.background='#2563eb'}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 13L5.5 8L10.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button
                          className="slideshow-arrow right"
                          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,58,138,0.10)', transition: 'background 0.18s, color 0.18s', opacity: 0.95, outline: 'none' }}
                          onClick={() => setSlideshowIndex(prev => prev === selectedRowData.images.length - 1 ? 0 : prev + 1)}
                          aria-label="Next image"
                          onMouseOver={e => e.currentTarget.style.background='#1e3a8a'}
                          onMouseOut={e => e.currentTarget.style.background='#2563eb'}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 13L10.5 8L5.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </>
                    )}
                    <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                      {selectedRowData.images.map((_, idx) => (
                        <span key={idx} style={{ width: 8, height: 8, borderRadius: '50%', background: slideshowIndex === idx ? '#2563eb' : '#cbd5e1', display: 'inline-block', transition: 'background 0.18s', cursor: 'pointer' }} onClick={() => setSlideshowIndex(idx)}></span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 22, background: '#f1f5f9', borderRadius: 18 }}>No Image</div>
                )}
              </div>
              <div className="admin-modal-details" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Product Name</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.name}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Product Type</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.type}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Product Price</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17, color: '#2563eb' }}>₹ {selectedRowData.price}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Stock</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.stock === true ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Model Year</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.modelYear}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>No. of Owners</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.owners}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>FC Years</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.fcYears}</div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Insurance</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>{selectedRowData.insurance ? 'Yes' : 'No'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Description</div>
                  <div className="admin-modal-value" style={{ fontWeight: 500, fontSize: 16, color: '#222', background: '#f9fafb', borderRadius: 10, padding: 12, marginTop: 2 }}>{selectedRowData.description || selectedRowData.info}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

