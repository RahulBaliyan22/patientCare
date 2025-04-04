import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, address } = formData;

    if (!name || !email || !password || !address) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://patientcare-2.onrender.com/adminsignup",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Registration successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="page-container">
      <div className="medication-form">
        <h2>Hospital Admin Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Hospital Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter hospital name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Hospital Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter hospital email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set a password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Hospital Address</label>
            <input
              className="form-input"
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter hospital address"
              required
            />
          </div>

          <button className="submit-button" type="submit">
            Register Hospital
          </button>
        </form>

        <div className="login-link">
          <p>Already registered? <Link to="/admin/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
