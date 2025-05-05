import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import dashboard styles
import Timeline from "./Timeline";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
import { AuthContext } from "../../main";
import Data from "../HealthRecord/Data";
import NewComponents from "../NewComponent/NewComponents";
const Dashboard = () => {
  const [user, setUser] = useState(null); // Holds user's data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  // Sample medical history data (you can replace this with dynamic data from API)
  const [medicalHistory, setMedicalHistory] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `https://patientcare-2.onrender.com/dashboard`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.patient);
        setMedicalHistory(response.data.records);
      } catch (error) {
        if(localStorage.getItem("user")){
        localStorage.removeItem("user");
        }
        setError("Error fetching patient data. Please try again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      toast.info("Please log in to continue.");
    }
  }, [navigate]);

  // Handle rendering based on the loading, error, and user state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Welcome{" "}
          <h1>
            {user ? (
              user.isFirstTimeUser ? (
                <>
                  Welcome to PatientCare!
                  <br />
                </>
              ) : user.lastLogin == null ? (
                <>Welcome, {user.name}</>
              ) : (
                <>Welcome back, {user.name}</>
              )
            ) : (
              "Loading..."
            )}
          </h1>
        </h1>

        {user && user.isFirstTimeUser && (
          <p className="welcome-message">
            We're excited to have you! Let's get started by adding your medical
            records.
          </p>
        )}

        {user && !user.isFirstTimeUser && (
          <p className="last-login">
            {user.lastLogin && (
              <>
                Last Login:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(user.lastLogin))}
              </>
            )}
          </p>
        )}
        <p style={{ color: "white" }}>
          Your Patient ID: <strong>{user.uid}</strong>. Connect with registered
          hospitals to get a more personalized experience.
        </p>
      </header>

      {user && user.isFirstTimeUser && (
        <div className="welcome-cards">
          <div className="dashboard-card">
            <h2>Start Your Health Journey</h2>
            <p>
              To make the most of PatientCare, begin by adding your first
              medical record.
            </p>
            <button
              className="action-btn"
              onClick={() => navigate("/add-record")}
            >
              Add Your First Record
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Set Up Your Profile</h2>
            <p>
              Personalize your account by updating your profile and settings.
            </p>
            <button
              className="action-btn"
              onClick={() => navigate("/settings")}
            >
              Set Up Profile
            </button>
          </div>
        </div>
      )}

      {!user?.isFirstTimeUser && (
        <>
          <div className="add-Flex">
            <Data />
            <div className="dashboard-card" style={{ alignContent: "center" }}>
              <h2>Check Your Vitals</h2>
              <p>Monitor and manage your health records in one place.</p>
              <button
                className="action-btn"
                onClick={() => navigate("/vital-check")}
              >
                Check Vitals
              </button>
            </div>
          </div>
          <Timeline history={medicalHistory} itemsPerPage={3} />
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
          <button
            className="action-btn"
            onClick={() => navigate("/medications")}
          >
            View Medications
          </button>
        </div>

        <div className="dashboard-card">
          <h2>View Your Contacts</h2>
          <p>View and manage your contacts in one place.</p>
          <button
            className="action-btn"
            onClick={() => navigate("/contact/show")}
          >
            My Contacts
          </button>
        </div>
        <div className="dashboard-card">
          <h2> What's new !</h2>
          <div className="what">{<NewComponents />}</div>
        </div>
        <div className="dashboard-card">
          <h2>Add Patient Record</h2>
          <p>View and manage your health records in one place.</p>
          <button
            className="action-btn"
            onClick={() => navigate("/add-record")}
          >
            Add Records
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
