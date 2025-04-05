import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AdminSettings = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    return {
      name: storedUser.name || "",
      email: storedUser.email || "",
      address: storedUser.address || "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !localStorage.getItem("user")) {
      navigate("/admin/login");
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
    if (!userDetails.name || !userDetails.email || !userDetails.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `https://patientcare-2.onrender.com/admin/update`,
        userDetails,
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(userDetails));
        navigate("/admin/dashboard");
        toast.success("User details updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.data.details?.[0]?.message || "Update failed.");
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
          <label className="form-label">Address:</label>
          <textarea
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <button
            className="submit-button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
