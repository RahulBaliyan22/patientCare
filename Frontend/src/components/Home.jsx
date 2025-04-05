import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css"; // Import styling
import { AuthContext } from "../main";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const Home = () => {
  const {isLoggedIn,setisLoggedIn} = useContext(AuthContext)
  const nav = useNavigate()
  useEffect(()=>{
    if(isLoggedIn || localStorage.getItem('user')){
      const clientString = localStorage.getItem("user");
      const client = clientString ? JSON.parse(clientString) : null;
  
      if (client?.role === "patient") {
        nav("/dashboard")
      } else if (client?.role === "admin") {
        nav("/admin/dashboard")
      }
    };
  },[nav])
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to PatientCare</h1>
          <p>Your trusted partner in managing patient records, medical history, and healthcare services.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h2>Secure Patient Record Management</h2>
          <p>Effortlessly manage and access medical records, past treatments, and medications for both patients and healthcare providers.</p>
        </div>
        <div className="feature">
          <h2>Enhanced Healthcare Solutions</h2>
          <p>Our platform offers healthcare professionals a comprehensive view of patient history, improving diagnosis and treatment.</p>
        </div>
        <div className="feature">
          <h2>Data Security & Privacy</h2>
          <p>Your health data is secured with the highest standards of encryption to ensure privacy and trust.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
