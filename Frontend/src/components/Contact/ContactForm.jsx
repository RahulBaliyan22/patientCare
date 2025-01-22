import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';


const ContactForm = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    isPrimary: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`https://patientcare-2.onrender.com/contact`, contact, {withCredentials:true});
      toast.success(response.data.message);
      setContact({
        name: '',
        email: '',
        phone: '',
        isPrimary: false
      });
    } catch (err) {
      console.error('Error creating contact:', err);
      setError(err.response?.data?.message || 'Failed to create contact.');
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
     
      <form onSubmit={handleSubmit} className="medication-form">
      <h2>Create Contact</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
            placeholder="Enter contact name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            className="form-input"
            type="text"
            id="phone"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="form-group">
  <label className="form-label" htmlFor="isPrimary">
    Set as Primary Contact
  </label>
  <input
    style={{ width: "10px" }}
    type="checkbox"
    id="isPrimary"
    name="isPrimary"
    checked={contact.isPrimary}
    onChange={(e) =>
      setContact((prev) => ({
        ...prev,
        isPrimary: e.target.checked, 
      }))
    }
  />
</div>
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Contact'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
