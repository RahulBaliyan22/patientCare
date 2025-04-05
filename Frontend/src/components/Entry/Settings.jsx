import React, { useState, useContext, useEffect } from "react";
// import "./Settin.css"; // Using Create.css for consistent styling
import { AuthContext } from "../../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Settings = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    // Convert DOB to the format required by input[type="date"] (yyyy-mm-dd)
    const formatDOB = storedUser.DOB
      ? new Date(storedUser.DOB).toISOString().split('T')[0]
      : "";
    console.log(formatDOB)
    return {
      name: storedUser.name || "",
      email: storedUser.email || "",
      phone: storedUser.phone || "",
      gender: storedUser.gender || "Male",
      bloodGroup: storedUser.bloodGroup || "O+",
      DOB: formatDOB, // Ensure DOB is in the right format for input[type="date"]
      address: storedUser.address || "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !localStorage.getItem("user")) {
      navigate("/login");
      setIsLoggedIn(false);
      toast.success("Log in first");
    }
  }, [navigate, isLoggedIn, setIsLoggedIn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validation before submitting
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Save updated details to backend (example using axios)
      const response = await axios.put(`https://patientcare-2.onrender.com/update`, userDetails, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(userDetails)); // Save to localStorage

        toast.success("User details updated successfully!");
        setTimeout(() => {
          window.location.href = "/profile"; // or full URL like 'http://yourdomain.com/profile'
        }, 500);
      }else{
       toast.error(response.details[0].message) 
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="medication-form">
        <h2>Account Settings</h2>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address:</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender:</label>
          <select
            name="gender"
            value={userDetails.gender}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date of Birth:</label>
          <input
            type="date"
            name="DOB"
            value={userDetails.DOB}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Blood Group:</label>
          <select
            name="bloodGroup"
            value={userDetails.bloodGroup}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Address:</label>
          <textarea
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <button className="submit-button" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
