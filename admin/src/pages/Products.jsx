import React, { useEffect, useState } from 'react';
import AddProducts from './forms/AddProducts';
import Swal from 'sweetalert2';
import { BsEyeFill, BsPencilFill, BsTrashFill } from 'react-icons/bs';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { useAuth } from '../AuthProvider';

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
  const [previewImage, setPreviewImage] = useState(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const uniqueProductTypes = [...new Set(tableData.map(product => product.type))];
  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // Add state to track removed images and combine previews
  const [removedImages, setRemovedImages] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const { authFetch } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    if (editdata && editdata.imageURL) {
      setPreviewImage(editdata.imageURL);
    }
  }, [editdata]);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setTableData(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setTableData([]);
    }
    setLoading(false);
  };


  const getproducts = () => {
    fetchProducts();
  };


  const handleEdit = (row) => {
    seteditproduct(true);
    seteditdata(row);
  };

  const handleDelete = (id) => {
    setDeleteProductId(id);
  };
  const confirmDeleteProduct = async () => {
    setLoading(true);
    try {
      await authFetch(`${API_URL}/api/products/${deleteProductId}`, {
        method: 'DELETE',
      });
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<span style="color:#16a34a;font-weight:700;font-size:22px;">Product Deleted!</span>',
          html: '<div style="color:#444;font-size:16px;margin-top:8px;">The product was successfully deleted.</div>',
          background: '#f0fdfa',
          showConfirmButton: false,
          timer: 1400,
          customClass: { popup: 'swal2-animate-success' }
        });
      }, 400);
      fetchProducts();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete product.'
        });
      }, 1000);
    }
    setDeleteProductId(null);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    seteditproduct(false); // Close modal immediately on submit
    const { _id, ...updatedDetails } = editdata;
    try {
      const formData = new FormData();
      formData.append('name', updatedDetails.name);
      formData.append('price', updatedDetails.price ? Number(updatedDetails.price) : '');
      formData.append('stock', updatedDetails.stock === true);
      formData.append('type', updatedDetails.type);
      formData.append('modelYear', updatedDetails.modelYear ? Number(updatedDetails.modelYear) : '');
      formData.append('owners', updatedDetails.owners ? Number(updatedDetails.owners) : '');
      formData.append('description', updatedDetails.info || updatedDetails.description || '');
      // Combine newImages and images that are not removed
      const allImages = [...newImages, ...editdata.images.filter(img => !removedImages.includes(img))];
      allImages.forEach(file => formData.append('images', file));
      formData.append('fc', editdata.fc ? 'true' : 'false');
      if (editdata.fc) {
        formData.append('fcDuration', editdata.fcDuration);
        formData.append('fcUnit', editdata.fcUnit);
      }
      formData.append('insurance', editdata.insurance ? 'true' : 'false');
      if (editdata.insurance) {
        formData.append('insuranceDuration', editdata.insuranceDuration);
        formData.append('insuranceUnit', editdata.insuranceUnit);
      }
      const response = await authFetch(`${API_URL}/api/products/${_id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Product has been updated.',
            showConfirmButton: false,
            timer: 1200
          });
        }, 1000);
        getproducts();
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Failed to update product',
          text: errorData.error || '',
          showConfirmButton: false,
          confirmButtonColor: 'black',
          timer: 1200
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        showConfirmButton: false,
        confirmButtonColor: 'black',
      });
    }
  };

  // Remove handleSearch and its usages

  // Instead, use controlled inputs and a useEffect for filtering:
  const handleSearchInput = (e) => setSearchText(e.target.value);
  const handleTypeChange = (e) => setSelectedType(e.target.value);

  // Filtering logic in useEffect
  useEffect(() => {
    let filteredItems = tableData;

    if (searchText) {
      filteredItems = filteredItems.filter((item) =>
        item.name && item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (selectedType) {
      filteredItems = filteredItems.filter((item) =>
        item.type && item.type.toLowerCase() === selectedType.toLowerCase()
      );
    }
    setFilteredData(filteredItems);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [searchText, selectedType, tableData]);

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setSlideshowIndex(0);
    setModalOpen(true);
  };

  const handleToggleStatus = (id, currentStatus) => {
    setStatusChange({ id, newStatus: currentStatus === 'active' ? 'inactive' : 'active' });
  };
  const confirmStatusChange = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/products/${statusChange.id}`, { 
        status: statusChange.newStatus
      });
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<span style="color:#16a34a;font-weight:700;font-size:22px;">Status Updated!</span>',
          html: `<div style="color:#444;font-size:16px;margin-top:8px;">Product is now <b>${statusChange.newStatus}</b>.</div>`,
          background: '#f0fdfa',
          showConfirmButton: false,
          timer: 1400,
          customClass: { popup: 'swal2-animate-success' }
        });
      }, 400);
      fetchProducts();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update product status.'
        });
      }, 1000);
    }
    setStatusChange(null);
  };

  const handleBulkDelete = () => {
    setBulkDelete(true);
  };
  const confirmBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedProducts.map(id => axios.delete(`${API_URL}/api/products/${id}`)));
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<span style="color:#16a34a;font-weight:700;font-size:22px;">Products Deleted!</span>',
          html: `<div style="color:#444;font-size:16px;margin-top:8px;">${selectedProducts.length} products were successfully deleted.</div>`,
          background: '#f0fdfa',
          showConfirmButton: false,
          timer: 1400,
          customClass: { popup: 'swal2-animate-success' }
        });
      }, 400);
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete some products.'
        });
      }, 1000);
    }
    setBulkDelete(false);
  };

  const handleBulkToggleStatus = async (status) => {
    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Products Selected',
        text: 'Please select products to update.'
      });
      return;
    }

    setLoading(true);
    try {
      await Promise.all(selectedProducts.map(id => 
        axios.put(`${API_URL}/api/products/${id}`, { status })
      ));
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `${selectedProducts.length} products are now ${status}.`,
          showConfirmButton: false,
          timer: 1200
        });
      }, 1000);
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update some products.'
        });
      }, 1000);
    }
  };

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchText, selectedType]);

  if (loading) {
    return <LoadingSpinner fullscreen text="Loading Vehicles..." />;
  }
  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">
        <div className="card" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(30,58,138,0.10)', border: 'none', padding: 0 }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '28px 0 18px 0', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, margin: 0 }}>Vehicles</h2>
          </div>
          <div style={{ padding: 32 }}>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2 flex-wrap" style={{ flex: 1, minWidth: 260 }}>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="form-select"
                  style={{ border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 15, minWidth: 120, maxWidth: 180 }}
                >
                  <option value="">All Types</option>
                  {uniqueProductTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, maxWidth: 320, background: '#fff', borderRadius: 999, boxShadow: '0 2px 8px #1e3a8a11', border: '1.5px solid #c7d2fe', padding: '2px 10px', transition: 'border 0.18s' }}>
                  <span style={{ background: '#2563eb', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                    <i className="bi bi-search" style={{ color: '#fff', fontSize: 18 }}></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search products by name"
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 500, padding: '10px 0', flex: 1, borderRadius: 999, color: '#1e293b' }}
                    value={searchText}
                    onChange={handleSearchInput}
                    onFocus={e => e.target.parentNode.style.border = '1.5px solid #2563eb'}
                    onBlur={e => e.target.parentNode.style.border = '1.5px solid #c7d2fe'}
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
                    <th className="mobile-visible" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Image</th>
                    <th className="mobile-visible" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Name</th>
                    <th className="mobile-hidden" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Type</th>
                    <th className="mobile-visible" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Price</th>
                    <th className="mobile-hidden" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Stock</th>
                    <th className="mobile-hidden" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Model Year</th>
                    <th className="mobile-visible" style={{ padding: 14, textAlign: 'left', fontWeight: 600, color: '#1e3a8a' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(product => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="mobile-visible" style={{ padding: 12, textAlign: 'center' }}>
                        {(product.images && product.images.length > 0) ? (
                          <img src={product.images[0]} alt="Product" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--border-gray)', background: '#fff' }} />
                        ) : (
                          <div style={{ color: '#aaa', fontSize: 22 }}>No Image</div>
                        )}
                      </td>
                      <td className="mobile-visible" style={{ padding: 12, fontWeight: 600 }}>{product.name}</td>
                      <td className="mobile-hidden" style={{ padding: 12 }}>{product.type}</td>
                      <td className="mobile-visible" style={{ padding: 12, fontWeight: 700 }}>₹ {product.price}</td>
                      <td className="mobile-hidden" style={{ padding: 12 }}>{product.stock === true ? 'Yes' : 'No'}</td>
                      <td className="mobile-hidden" style={{ padding: 12 }}>{product.modelYear}</td>
                      <td className="mobile-visible" style={{ padding: 12 }}>
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
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ border: 'none', background: currentPage === 1 ? '#e5e7eb' : '#2563eb', color: '#fff', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 16, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #1e3a8a11', transition: 'background 0.18s' }}>Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) ? (
                      <button key={page} onClick={() => setCurrentPage(page)} style={{ border: 'none', background: page === currentPage ? 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)' : '#fff', color: page === currentPage ? '#fff' : '#2563eb', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 16, boxShadow: page === currentPage ? '0 2px 8px #1e3a8a22' : '0 2px 8px #1e3a8a11', margin: '0 2px', cursor: 'pointer', borderBottom: page === currentPage ? '2.5px solid #2563eb' : '2.5px solid transparent', transition: 'all 0.18s' }}>{page}</button>
                    ) : (
                      (page === currentPage - 2 || page === currentPage + 2) && totalPages > 5 ? <span key={page} style={{ color: '#64748b', fontWeight: 700, fontSize: 18, margin: '0 4px' }}>...</span> : null
                    )
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ border: 'none', background: currentPage === totalPages ? '#e5e7eb' : '#2563eb', color: '#fff', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 16, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #1e3a8a11', transition: 'background 0.18s' }}>Next</button>
                </div>
              )}
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
              <form onSubmit={handleEditSave} style={{ padding: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  {/* Row 1: Product Name, Product Stock */}
                  <div style={{ display: 'flex', gap: 18 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={editdata.name || ''}
                        onChange={e => seteditdata({ ...editdata, name: e.target.value })}
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
                        value={String(editdata.stock)}
                        onChange={e => seteditdata({ ...editdata, stock: e.target.value === 'true' })}
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
                        type="number"
                        name="price"
                        value={editdata.price || ''}
                        onChange={e => seteditdata({ ...editdata, price: e.target.value })}
                        required
                        placeholder="Product Price"
                        min="0"
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Type *</label>
                      <input
                        name="type"
                        value={editdata.type || ''}
                        onChange={e => seteditdata({ ...editdata, type: e.target.value })}
                        required
                        placeholder="Product Type"
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      />
                    </div>
                  </div>
                  {/* Row 3: Model Year, No. of Owners */}
                  <div style={{ display: 'flex', gap: 18 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Model Year *</label>
                      <input
                        type="number"
                        name="modelYear"
                        value={editdata.modelYear || ''}
                        onChange={e => seteditdata({ ...editdata, modelYear: e.target.value })}
                        required
                        placeholder="Model Year"
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
                        type="number"
                        name="owners"
                        value={editdata.owners || ''}
                        onChange={e => seteditdata({ ...editdata, owners: e.target.value })}
                        required
                        placeholder="No. of Owners"
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
                        value={editdata.fc === true ? 'true' : editdata.fc === false ? 'false' : ''}
                        onChange={e => seteditdata({ ...editdata, fc: e.target.value === 'true', fcDuration: '', fcUnit: 'year' })}
                        required
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {editdata.fc && (
                        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                          <input
                            type="number"
                            name="fcDuration"
                            value={editdata.fcDuration || ''}
                            onChange={e => seteditdata({ ...editdata, fcDuration: e.target.value })}
                            required={editdata.fc}
                            placeholder="No. of Years/Months"
                            min="1"
                            style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                            onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                            onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                          />
                          <select
                            name="fcUnit"
                            value={editdata.fcUnit || 'year'}
                            onChange={e => seteditdata({ ...editdata, fcUnit: e.target.value })}
                            style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                          >
                            <option value="year">Year(s)</option>
                            <option value="month">Month(s)</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Insurance *</label>
                      <select
                        name="insurance"
                        value={editdata.insurance === true ? 'true' : editdata.insurance === false ? 'false' : ''}
                        onChange={e => seteditdata({ ...editdata, insurance: e.target.value === 'true', insuranceDuration: '', insuranceUnit: 'year' })}
                        required
                        style={{ width: '100%', borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', marginTop: 4, background: '#f8fafc', transition: 'border 0.18s' }}
                        onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                        onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {editdata.insurance && (
                        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                          <input
                            type="number"
                            name="insuranceDuration"
                            value={editdata.insuranceDuration || ''}
                            onChange={e => seteditdata({ ...editdata, insuranceDuration: e.target.value })}
                            required={editdata.insurance}
                            placeholder="No. of Years/Months"
                            min="1"
                            style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                            onFocus={e => e.target.style.border = '1.5px solid #2563eb'}
                            onBlur={e => e.target.style.border = '1.5px solid #c7d2fe'}
                          />
                          <select
                            name="insuranceUnit"
                            value={editdata.insuranceUnit || 'year'}
                            onChange={e => seteditdata({ ...editdata, insuranceUnit: e.target.value })}
                            style={{ flex: 1, borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '12px 14px', fontSize: 16, fontWeight: 500, outline: 'none', background: '#f8fafc', transition: 'border 0.18s' }}
                          >
                            <option value="year">Year(s)</option>
                            <option value="month">Month(s)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Row 5: Product Images (full width) */}
                  <div className="form-group">
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Images</label>
                    <input
                      accept="image/*"
                      type="file"
                      multiple
                      onChange={e => {
                        const files = Array.from(e.target.files);
                        setNewImages(files);
                        setPreviewImages(files.map(file => URL.createObjectURL(file)));
                      }}
                      style={{ borderRadius: 12, border: '1.5px solid #c7d2fe', padding: '10px', background: '#f8fafc', marginTop: 4 }}
                    />
                    {/* Only show newly selected images */}
                    {previewImages.length > 0 && (
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
                        {previewImages.map((src, idx) => (
                          <div key={src} style={{ position: 'relative' }}>
                            <img
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
                            <button
                              type="button"
                              onClick={() => {
                                const newImgs = [...newImages];
                                const newPrevs = [...previewImages];
                                newImgs.splice(idx, 1);
                                newPrevs.splice(idx, 1);
                                setNewImages(newImgs);
                                setPreviewImages(newPrevs);
                              }}
                              style={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: 22,
                                height: 22,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 16,
                                zIndex: 2
                              }}
                              aria-label="Remove image"
                              title="Remove image"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Row 6: Product Description (full width) */}
                  <div className="form-group">
                    <label style={{ color: '#1e3a8a', fontWeight: 600 }}>Product Description *</label>
                    <textarea
                      name="description"
                      value={editdata.info || editdata.description || ''}
                      onChange={e => seteditdata({ ...editdata, info: e.target.value })}
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
                    Save
                  </button>
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
                      src={
                        selectedRowData.images[slideshowIndex]
                          ? selectedRowData.images[slideshowIndex].startsWith('http')
                            ? selectedRowData.images[slideshowIndex]
                            : `${API_URL}${selectedRowData.images[slideshowIndex]}`
                          : ''
                      }
                      loading="lazy"
                      alt="Product"
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
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>FC</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>
                    {selectedRowData.fc ? 'Yes' : 'No'}
                    {selectedRowData.fc && selectedRowData.fcDuration && selectedRowData.fcUnit && (
                      <span style={{ marginLeft: 8, color: '#2563eb', fontWeight: 600 }}>
                        ({selectedRowData.fcDuration} {selectedRowData.fcUnit}{selectedRowData.fcDuration > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="admin-modal-label" style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Insurance</div>
                  <div className="admin-modal-value" style={{ fontWeight: 700, fontSize: 17 }}>
                    {selectedRowData.insurance ? 'Yes' : 'No'}
                    {selectedRowData.insurance && selectedRowData.insuranceDuration && selectedRowData.insuranceUnit && (
                      <span style={{ marginLeft: 8, color: '#2563eb', fontWeight: 600 }}>
                        ({selectedRowData.insuranceDuration} {selectedRowData.insuranceUnit}{selectedRowData.insuranceDuration > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
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
      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#dc2626', marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Delete Product?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to delete this product? This action cannot be undone.</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setDeleteProductId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmDeleteProduct} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Delete Confirmation Modal */}
      {bulkDelete && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#dc2626', marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Delete Selected Products?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to delete {selectedProducts.length} products? This action cannot be undone.</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setBulkDelete(false)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmBulkDelete} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #dc2626 60%, #f87171 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Status Change Confirmation Modal */}
      {statusChange && (
        <div>
          <div
            className="modal d-block border-0 admins-modal-bg"
            role="dialog"
            style={{ background: 'rgba(30,58,138,0.10)', backdropFilter: 'blur(2px)' }}
          >
            <div className="modal-dialog modal-lg border-0 modal-dialog-centered ">
              <div className="modal-content border-0 rounded-4" style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)', background: '#fff' }}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, color: '#dc2626', marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#dc2626', marginBottom: 10 }}>Change Product Status?</h3>
                  <div style={{ color: '#444', marginBottom: 22 }}>Are you sure you want to change the status to <b>{statusChange.newStatus}</b>?</div>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => setStatusChange(null)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={confirmStatusChange} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Change</button>
                  </div>
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

