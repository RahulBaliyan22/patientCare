import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css'; // Import CSS for the error page
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-container">
      <div className="error-content">
        <h1 className="error-title">Oops!</h1>
        <p className="error-message">Something went wrong or the page you're looking for doesn't exist.</p>
        <button className="go-back-btn" onClick={() => navigate('/')}>Go Back to Home</button>
      </div>
    </div>
  );
};

export default Error;
