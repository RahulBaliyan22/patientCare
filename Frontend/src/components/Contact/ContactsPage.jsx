import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ContactsPage.css';
import { useNavigate } from 'react-router-dom';

const ContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`https://patientcare-2.onrender.com/contacts`, {
          withCredentials: true,
        });
        setContacts(response.data.contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to load contacts!');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [contacts]); // Removed contacts dependency

  const handleUpdate = (id) => {
    navigate(`/contact/update/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.VITE_BACKEND_URL}/contact/delete/${id}`,
        { withCredentials: true }
      );
      setContacts((prevContacts) =>
        prevContacts.filter((item) => item._id !== id)
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact.');
    }
  };

  // Handle toggling the primary status of a contact
  const handleTogglePrimary = async (contactId) => {
    try {
      const response = await axios.put(
        `https://patientcare-2.onrender.com/contact/${contactId}/toggle-primary`,
        {},
        { withCredentials: true }
      );
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === contactId
            ? { ...contact, isPrimary: !contact.isPrimary }
            : contact
        )
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling primary status:', error);
      toast.error('Failed to update contact status.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading contacts...</div>;
  }

  return (
    <div className="contact-show-page">
      <h1>All Contacts</h1>
      <div className="contact-grid">
        {contacts && contacts.length > 0 ? (
          contacts.map(
            (contact) =>
              contact.isVerified && (
                <div
                  key={contact._id}
                  className={`contact-card ${
                    contact.isPrimary ? 'primary' : ''
                  }`}
                >
                  <div className="btn-new00">
                    <svg
                      onClick={() => {
                        handleUpdate(contact._id);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="40px"
                      viewBox="0 -960 960 960"
                      width="40px"
                      fill="#004d4d"
                    >
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                  </div>
                  <div className="btn-new00">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40px"
                      viewBox="0 -960 960 960"
                      width="40px"
                      fill="red"
                      onClick={() => {
                        handleDelete(contact._id);
                      }}
                    >
                      <path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" />
                    </svg>
                  </div>
                  <h3>{contact.name}</h3>
                  <p>Email: {contact.email}</p>
                  <p>Phone: {contact.phone}</p>
                  {contact.isPrimary && (
                    <p className="status primary-status">Primary Contact</p>
                  )}
                  {!contact.isPrimary && (
                    <button
                      onClick={() => {
                        handleTogglePrimary(contact._id);
                      }}
                    >
                      Set as Primary
                    </button>
                  )}
                </div>
              )
          )
        ) : (
          <h2>No contacts available</h2>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
