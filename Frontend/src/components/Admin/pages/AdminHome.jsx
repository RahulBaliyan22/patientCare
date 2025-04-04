import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Home.css"; // Reuse your existing styles

function AdminHome() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const getHospitals = async () => {
      try {
        const resp = await axios.get("https://patientcare-2.onrender.com/admin/gethospitals", {
          withCredentials: true,
        });
        setHospitals(resp.data.hospitals);
      } catch (e) {
        console.log("Error fetching hospitals:", e);
      }
    };

    getHospitals();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Admin Portal</h1>
          <p>Register a new hospital or manage existing hospital information.</p>
          <div className="cta-buttons">
            <Link to="/admin/signup" className="btn-primary">
              Register New Hospital
            </Link>
            <Link to="/admin/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Hospitals Listing Section */}
      <section className="features">
        <div className="feature" style={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
          <h2>Registered Hospitals</h2>
          {hospitals.length > 0 ? (
            <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
              {hospitals.map((hospital, index) => (
                <li key={index}>
                  <strong>{hospital.name}</strong> - {hospital.address}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hospitals found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminHome;
