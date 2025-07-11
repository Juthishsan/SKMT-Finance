import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner';

const AddProducts = ({ setaddproduct, getproducts, productTypes }) => {
    const productname = useRef();
    const productprice = useRef();
    const productstock = useRef();
    const productinfo = useRef();
    const modelYear = useRef();
    const owners = useRef();
    const fcYears = useRef();
    const insurance = useRef();
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [productType, setProductType] = useState('');
    const [isNewProductType, setIsNewProductType] = useState(false);
    const [newProductType, setNewProductType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setImagePreviews(selectedFiles.map(file => URL.createObjectURL(file)));
    };

    const handleProductTypeChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setIsNewProductType(true);
            setProductType('');
        } else {
            setIsNewProductType(false);
            setProductType(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', productname.current.value);
        formData.append('price', productprice.current.value);
        formData.append('stock', productstock.current.value === 'true');
        formData.append('type', isNewProductType ? newProductType : productType);
        formData.append('description', productinfo.current.value);
        formData.append('modelYear', modelYear.current.value);
        formData.append('owners', owners.current.value);
        formData.append('fcYears', fcYears.current.value);
        formData.append('insurance', insurance.current.value);
        files.forEach(file => formData.append('images', file));

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
                method: 'POST',
                body: formData,
            });
            setLoading(false);
            if (response.ok) {
                setTimeout(() => {
            Swal.fire({
                icon: 'success',
                    title: 'Product added successfully!',
                showConfirmButton: true,
                confirmButtonColor: 'black',
            });
                }, 100);
                setaddproduct(false);
            getproducts();
            } else {
                setTimeout(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to add product',
                    showConfirmButton: true,
                    confirmButtonColor: 'black',
                });
                }, 100);
            }
        } catch (error) {
            setLoading(false);
            setTimeout(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                showConfirmButton: true,
                confirmButtonColor: 'black',
            });
            }, 100);
        }
    };

    if (loading) return <LoadingSpinner fullscreen text="Adding Product..." />;

    return (
        <form onSubmit={handleSubmit} className="grid grid-2 gap-4 add-product-form">
            <div className="form-group full-width">
                <label className="mb-2 fw-bold text-primary-blue">Product Images</label>
                <input
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                    className="input-field"
                    required
                    id="images"
                    multiple
                />
                <div className="image-preview-list">
                    {imagePreviews.map((src, idx) => (
                        <div key={idx} className="image-preview-item">
                            <img src={src} alt="Preview" className="image-preview-img" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">Product Name</label>
                <input className="input-field" placeholder="Product Name" ref={productname} required />
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">Product Stock</label>
                <select className="input-field" ref={productstock} required>
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">Product Price</label>
                <input className="input-field" placeholder="Product Price" ref={productprice} type="number" min="0" required />
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">Product Type</label>
                {!isNewProductType ? (
                    <select className="input-field" value={productType} onChange={handleProductTypeChange} required>
                        <option value="">Select Type</option>
                        {productTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">New Type</option>
                    </select>
                ) : (
                    <input
                        className="input-field"
                        placeholder="New Product Type"
                        value={newProductType}
                        onChange={e => setNewProductType(e.target.value)}
                        required
                    />
                )}
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">Model Year</label>
                <input className="input-field" placeholder="Model Year" ref={modelYear} type="number" min="1900" max={new Date().getFullYear()} required />
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">No. of Owners</label>
                <input className="input-field" placeholder="No. of Owners" ref={owners} type="number" min="1" required />
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">FC Years</label>
                <input className="input-field" placeholder="FC Years" ref={fcYears} type="number" min="0" required />
            </div>
            <div className="form-group">
                <label className="mb-2 fw-bold text-primary-blue">Insurance</label>
                <select className="input-field" ref={insurance} required>
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div className="form-group full-width">
                <label className="mb-2 fw-bold text-primary-blue">Product Description</label>
                <textarea className="input-field pt-2" placeholder="Product Description" ref={productinfo} required rows={4}></textarea>
            </div>
            <div className="col-md-12 mb-4 px-5 text-center full-width">
                <button
                    className="btn btn-primary add-product-submit-btn"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default AddProducts;
