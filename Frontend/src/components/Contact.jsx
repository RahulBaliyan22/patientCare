import React, { useState } from "react";
import axios from "axios";
import "./Contact.css"; // Styling for ContactPage
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const Contact = () => {
  const [form, setForm] = useState({
    name: JSON.parse(localStorage.getItem("user"))?.name || "",
    email: JSON.parse(localStorage.getItem("user"))?.email || "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://patientcare-2.onrender.com/sendQuery", form,{withCridentials:true}); // Adjust to your API route
      alert("Your message has been sent successfully. We will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      console.log(`Error: ${e}`);
      alert("There was an issue sending your message. Please try again.");
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact PatientCare</h1>
      <p>If you have any questions, need assistance with your medical records, or have any concerns, we are here to help. Please reach out to us!</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-submit">
          Send Message
        </button>
      </form>

      {/* Company Contact Info */}
      <div className="contact-info">
        <h2>Our Office</h2>
        <p>PatientCare, 123 Health Lane, Wellness City, Country</p>
        <p>Email: support@patientcare.com</p>
        <p>Phone: (123) 456-7890</p>

        {/* Map Section */}
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.345163632818!2d77.82700597528043!3d28.408840075787637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ca33b9080c981%3A0x783618d9d20a128c!2syamunapurm%20bulandshahr!5e0!3m2!1sen!2sin!4v1736930267720!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
