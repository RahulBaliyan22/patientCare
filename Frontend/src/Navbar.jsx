import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./main";
import "./Navbar.css";
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobile(!isMobile);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch(`https://patientcare-2.onrender.com/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {isLoggedIn ? (
          <Link to="/dashboard" className="logo">
            <h2>PatientCare</h2>
          </Link>
        ) : (
          <Link to="/" className="logo">
            <h2>PatientCare</h2>
          </Link>
        )}
        <ul className={`nav-links ${isMobile ? "mobile" : ""}`}>
          {isLoggedIn ? (
            <li>
              <Link to="/dashboard" className="nav-link">
                Home{" "}
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/" className="nav-link">
                Home{" "}
              </Link>
            </li>
          )}
          {isLoggedIn ? (
            <li className="navbar-item">
              <Link to="/records" className="nav-link">
                Records
              </Link>
              <div className="navbar-dropdown">
                <ul style={{ listStyleType: "none" }}>
                  <li>
                   
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/records");
                      }}
                    >
                      View
                    </button>
                  </li>
                  <li>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/add-record");
                      }}
                    >
                      Add
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/services" className="nav-link">
                Services
              </Link>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/about" className="nav-link">
                About Us
              </Link>
            </li>
          )}

          {isLoggedIn ? (
            <li className="navbar-item">
              <Link to="/contact/show" className="nav-link">
                Contact
              </Link>
              <div className="navbar-dropdown">
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/contact/show");
                      }}
                    >
                      View
                    </button>
                  </li>
                  <li>
                    
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/contact/add");
                      }}
                    >
                      Add
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <li className="navbar-item">
              <Link to="/medications" className="nav-link">
                Medication
              </Link>
              <div className="navbar-dropdown">
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/medications");
                      }}
                    >
                      View
                    </button>
                  </li>
                  <li>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/medications/add");
                      }}
                    >
                      Add
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          )}
          {isLoggedIn && localStorage.getItem("user") && (
            <li className="navbar-item">
              <Link to="/profile" className="nav-link">
                {`Hi : ${JSON.parse(localStorage.getItem("user")).name}`}
              </Link>
              <div className="navbar-dropdown">
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/settings");
                      }}
                    >
                      Edit
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          )}

          {isLoggedIn ? (
            <li>
              <button className="nav-link btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="nav-link btn-login">
                Login
              </Link>
            </li>
          )}
        </ul>

        <div
          className="mobile-menu-icon"
          onClick={handleMobileMenuToggle}
          aria-expanded={isMobile}
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
