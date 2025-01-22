import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/patient", {
          withCredentials: true,
        });
        setPatient(response.data.patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  if (!patient) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>{patient.name}</h1>
          <p>Email: {patient.email}</p>
        </div>
        <div className="profile-body">
          <div className="profile-info">
            <h2>Patient Information</h2>
            <p>
              <strong>Phone:</strong> {patient.phone}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {patient.DOB ? new Date(patient.DOB).toLocaleDateString() : "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {patient.gender || "N/A"}
            </p>
            <p>
              <strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {patient.address || "N/A"}
            </p>
          </div>

          <div className="profile-status">
            <h2>Status</h2>
            <p>
              <strong>Email Verified:</strong>{" "}
              {patient.isVerified ? "Yes" : "No"}
            </p>

            <p>
              <strong>Last Login:</strong>{" "}
              {patient.lastLogin
                ? new Date(patient.lastLogin).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="profile-records">
            <h2>Medical Records</h2>
            {patient.list && patient.list.length > 0 ? (
              <>
                <strong>Total Records:</strong> {patient.list.length}
              </>
            ) : (
              <p>No records available.</p>
            )}
          </div>

          <div className="profile-medications">
            <h2>Active Medications</h2>
            {patient.med && patient.med.length > 0 ? (
              <ul>
                {patient.med.map(
                  (medication) =>
                    !medication.isEnd && (
                      <li key={medication._id}>
                        {medication.name || "Unnamed Medication"}
                      </li>
                    )
                )}
              </ul>
            ) : (
              <p>No medications found.</p>
            )}
          </div>

          <div className="profile-contacts">
            <h2>Emergency Contacts</h2>
            {(patient.hasPrimaryContact?.isPrimary ) ? (
              <div>
                {patient.hasPrimaryContact.primaryContact.name} (
                {patient.hasPrimaryContact.primaryContact.phone})
                {patient.hasPrimaryContact.isPrimary && (
                  <em style={{ opacity: "0.7", marginLeft: "10em" }}>
                    Primary Contact
                  </em>
                )}
              </div>
            ) : (
              patient.contacts && patient.contacts.length > 0  &&
              <p>No Primary Key</p>
            )}

            {patient.contacts && patient.contacts.length > 0 ? (
              <ul>
                {patient.contacts.map((contact) =>
                  contact.isVerified && !contact.isPrimary ? (
                    <li key={contact._id}>
                      {contact.name} ({contact.phone})
                    </li>
                  ) : null
                )}
              </ul>
            ) : (
              <p>No emergency contacts added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
