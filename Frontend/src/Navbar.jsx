import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./main";
import "./Navbar.css";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobile(!isMobile);
  };

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("user")) {
      const clientString = localStorage.getItem("user");
      const client = clientString ? JSON.parse(clientString) : null;
      setUser(client);
    }
  }, [isLoggedIn]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      if (user?.role === "patient") {
        await fetch(`https://patientcare-2.onrender.com/logout`, {
          method: "POST",
          credentials: "include",
        });
        localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
      } else if (user?.role === "admin") {
        await fetch(`https://patientcare-2.onrender.com/admin/logout`, {
          method: "POST",
          credentials: "include",
        });
        localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/admin/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to={
            isLoggedIn
              ? user?.role === "admin"
                ? "/admin/dashboard"
                : "/dashboard"
              : "/"
          }
          className="logo"
        >
          <h2>PatientCare</h2>
        </Link>

        <ul className={`nav-links ${isMobile ? "mobile" : ""}`}>
          {/* Home */}
          <li>
            <Link
              to={
                isLoggedIn
                  ? user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/dashboard"
                  : "/"
              }
              className="nav-link"
            >
              Home
            </Link>
          </li>

          {/* Records */}
          {isLoggedIn && user?.role === "patient" && (
            <li className="navbar-item">
              <Link to="/records" className="nav-link">
                Records
              </Link>
              <div className="navbar-dropdown">
                <ul>
                  <li>
                    <button onClick={() => navigate("/records")}>View</button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/add-record")}>Add</button>
                  </li>
                </ul>
              </div>
            </li>
          )}

          {/* Services for Guests */}
          {!isLoggedIn && (
            <li>
              <Link to="/services" className="nav-link">
                Services
              </Link>
            </li>
          )}

          {/* About Us */}
          {!isLoggedIn && (
            <li>
              <Link to="/about" className="nav-link">
                About Us
              </Link>
            </li>
          )}

          {/* Contact */}
          {isLoggedIn && user?.role === "patient" ? (
            <li className="navbar-item">
              <Link to="/contact/show" className="nav-link">
                Contact
              </Link>
              <div className="navbar-dropdown">
                <ul>
                  <li>
                    <button onClick={() => navigate("/contact/show")}>
                      View
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/contact/add")}>Add</button>
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

          {/* Medications */}
          {isLoggedIn && user?.role === "patient" && (
            <li className="navbar-item">
              <Link to="/medications" className="nav-link">
                Medication
              </Link>
              <div className="navbar-dropdown">
                <ul>
                  <li>
                    <button onClick={() => navigate("/medications")}>
                      View
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/medications/add")}>
                      Add
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          )}

          {/* Profile */}
          {isLoggedIn && user && (
            <li className="navbar-item"> {user?.role === "patient"?(<><Link to="/profile" className="nav-link" title={user.uid}>
              {`Hi: ${user.name}`}
            </Link>
            <div className="navbar-dropdown">
              <ul>
                <li>
                  <button onClick={() => navigate("/settings")}>Edit</button>
                </li>
              </ul>
            </div></>):(<>
            <div className="nav-link">{`Hi: ${user.name}`}</div>
                
              <div className="navbar-dropdown">
                <ul>
                  <li>
                    <button onClick={() => navigate("/admin/settings")}>Edit</button>
                  </li>
                </ul>
              </div></>)}
              
            </li>
          )}

          {/* Hospitals */}
          {!isLoggedIn && (
            <li>
              <Link to="/admin/home" className="nav-link">
                Hospitals
              </Link>
            </li>
          )}

          {/* Login / Logout */}
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

        {/* Mobile Hamburger */}
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
