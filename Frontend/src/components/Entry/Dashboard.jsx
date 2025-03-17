import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Timeline from "./Timeline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../main";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("https://patientcare-2.onrender.com/dashboard", {
          withCredentials: true, 
        });

        if (response.data && response.data.patient && response.data.records) {
          setUser(response.data.patient);
          setMedicalHistory(response.data.records);
          setIsLoggedIn(true); // ✅ Ensure logged-in state updates
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || "Error fetching patient data. Please try again.");

        // ✅ If unauthorized, update context and redirect
        if (error.response?.status === 401) {
          setIsLoggedIn(false);
          navigate("/login");
          toast.info("Session expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // ✅ Only redirect if `isLoggedIn` is false
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      toast.info("Please log in to continue.");
    }
  }, [isLoggedIn, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Welcome{" "}
          {user ? 
            user.isFirstTimeUser ? "to PatientCare!" : 
            user.lastLogin ? `back, ${user.name}` : user.name
          : "Loading..."}
        </h1>

        {user?.isFirstTimeUser && (
          <p className="welcome-message">
            We're excited to have you! Let's get started by adding your medical records.
          </p>
        )}

        {!user?.isFirstTimeUser && user?.lastLogin && (
          <p className="last-login">
            Last Login:{" "}
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(new Date(user.lastLogin))}
          </p>
        )}
      </header>

      {user?.isFirstTimeUser ? (
        <div className="welcome-cards">
          <div className="dashboard-card">
            <h2>Start Your Health Journey</h2>
            <p>To make the most of PatientCare, begin by adding your first medical record.</p>
            <button className="action-btn" onClick={() => navigate("/add-record")}>
              Add Your First Record
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Set Up Your Profile</h2>
            <p>Personalize your account by updating your profile and settings.</p>
            <button className="action-btn" onClick={() => navigate("/settings")}>
              Set Up Profile
            </button>
          </div>
        </div>
      ) : (
        <>
          <Timeline history={medicalHistory} itemsPerPage={3} />
          <div className="dashboard-card">
            <h2>Add Patient Record</h2>
            <p>View and manage your health records in one place.</p>
            <button className="action-btn" onClick={() => navigate("/add-record")}>
              Add Records
            </button>
          </div>
        </>
      )}

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Patient Records</h2>
          <p>View and manage your health records in one place.</p>
          <button className="action-btn" onClick={() => navigate("/records")}>
            View Records
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Medication History</h2>
          <p>Access and review your past medications anytime.</p>
          <button className="action-btn" onClick={() => navigate("/medications")}>
            View Medications
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Settings</h2>
          <p>Update your account information and preferences.</p>
          <button className="action-btn" onClick={() => navigate("/settings")}>
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
