import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const UpdateContactForm = () => {
  let {id} = useParams();
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the contact details when the component mounts
  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://patientcare-2.onrender.com/contact/${id}`,{withCredentials:true});
        const cont = response.data.contact
        setContact({
          name: cont.name,
    email: cont.email,
    phone: cont.phone,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact details:', err);
        setError('Failed to fetch contact details.');
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

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
      const response = await axios.put(
        `https://patientcare-2.onrender.com/contact/update/${id}`,
        contact,
        { withCredentials: true }
      );

      if (response.data.message.includes('Verification email sent')) {
        toast.info(response.data.message);
      } else {
        toast.success('Contact updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      

      <form onSubmit={handleSubmit} className="medication-form">
      <h2>Update Contact</h2>
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

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Contact'}
        </button>
      </form>
    </div>
  );
};

export default UpdateContactForm;
