import React, { useState } from 'react'

import Swal from 'sweetalert2';




const Register = ({ componentrender, setaddadmin, getproducts }) => {


  const initialFormData = {
    name: '',
    phone: '',
    email: '',
    password: '',
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.table(formData)

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Registration is disabled',
      text: 'Authentication features are not available.',
      showConfirmButton: true,
      confirmButtonColor: 'black',
    });
      setFormData(initialFormData);
  };

  return (
    <div className='d-flex flex-column justify-content-center' style={{ height: "80vh" }}>
      <div className='d-flex flex-row justify-content-center'>
        <form
          onSubmit={handleSubmit}
        >
          <section className="register-container" id="register">
            <h4 className='text-center'>Register</h4>

            <p className="error-message" id="registerError" />

            <div className="input-box">
              <input
                type="text"
                id="registerFirstName"

                className="input-field"
                placeholder="Name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                required
              />
              <i className="fa fa-user" aria-hidden="true" />
            </div>
            <div className="input-box">
              <input
                type="text"
                name="phone"
                className="input-field"
                placeholder="Mobile No"
                value={formData.phone}
                onChange={handleChange}
                required

              />
              <i className="fa fa-phone" aria-hidden="true" />
            </div>


            <div className="input-box">
              <input
                type="text"
                id="registerEmail"
                className="input-field"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                required
              />

              <i className="fa fa-envelope" aria-hidden="true" />
            </div>
            <div className="input-box">
              <input
                type="password"

                name="password"
                className="input-field"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <i className="fa fa-lock" aria-hidden="true" />
            </div>



            <div className="input-box text-center">
              <button type="submit"
                name="submit" className='submit'>
                Add
              </button>
            </div>

          </section>
        </form>
      </div>


    </div>
  )
}

export default Register
