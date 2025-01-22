import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // Import styling for the forgot password page
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
import axios from 'axios';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    try{
    const response = await axios.post("http://localhost:8000/forgot-password",{email})
    toast.info(response.data.message)
    }catch(e){
      toast.error("error in email verification")
    }
    
    
    // Simulate navigation to login page after submitting the request
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h1 className="forgot-password-title">Forgot Password?</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Enter your email address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          {message && <p className="message">{message}</p>}
          <button type="submit" className="submit-btn">Send Reset Link</button>
        </form>
        <p className="back-to-login" onClick={() => navigate('/login')}>Back to Login</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
