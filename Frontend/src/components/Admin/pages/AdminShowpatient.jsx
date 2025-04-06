import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link ,useNavigate } from "react-router-dom";
import "../pages/Styles/AdminShowpatient.css";

const AdminShowPatient = () => {
  const nav = useNavigate();
  const [search] = useSearchParams();
  const patientId = search.get("patientId"); // Pass the key name as a string

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatient = async () => {
    try {
      const res = await axios.get(
        `https://patientcare-2.onrender.com/admin/getpatient/${patientId}`,
        { withCredentials: true }
      );
      setPatient(res.data.patient);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch patient data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  if (loading)
    return (
      <div className="admin-show-patient__loading">Loading patient data...</div>
    );
  if (error) return <div className="admin-show-patient__error">{error}</div>;

  return (
    <div className="admin-show-patient">
      <h2 className="admin-show-patient__heading">Patient Details</h2>

      <div className="admin-show-patient__details">
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>Age:</strong> {patient.age || "NA"}
        </p>
        <p>
          <strong>Gender:</strong> {patient.gender || "NA"}
        </p>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Phone:</strong> {patient.phone}
        </p>
      </div>

      {/* Active Medications */}
      <div className="admin-show-patient__medications">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 className="admin-show-patient__subheading">Active Medications</h3>
          <button className="admin-show-patient__add-button" onClick={()=>{nav(`/medications/add?patientId=${patientId}`)}}>+</button>
        </div>
        <div className="admin-show-patient__scroll">
          {patient.med?.filter((med) => !med.isEnd).length > 0 ? (
            <ul>
              {patient.med
                .filter((med) => !med.isEnd)
                .map((med, index) => (
                  <li key={index}>
                    <strong>{med.name}</strong> ({med.dosage || "N/A"}) <Link to={`/medications/update/${med._id}?patientId=${patient._id}`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></Link><br />
                    Start: {new Date(med.start).toLocaleDateString()}
                    {med.prescribedBy && (
                      <> | Prescribed by: {med.prescribedBy}</>
                    )}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No active medications.</p>
          )}
        </div>
      </div>

      {/* Non-Active Medications */}
      <div className="admin-show-patient__medications">
        <h3 className="admin-show-patient__subheading">
          Non-Active Medications
        </h3>
        <div className="admin-show-patient__scroll">
          {patient.med?.filter((med) => med.isEnd).length > 0 ? (
            <ul>
              {patient.med
                .filter((med) => med.isEnd)
                .map((med, index) => (
                  <li key={index}>
                    <strong>{med.name}</strong> ({med.dosage || "N/A"})<br />
                    Start: {new Date(med.start).toLocaleDateString()} — End:{" "}
                    {med.end ? new Date(med.end).toLocaleDateString() : "N/A"}
                    {med.prescribedBy && (
                      <> | Prescribed by: {med.prescribedBy}</>
                    )}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No non-active medications.</p>
          )}
        </div>
      </div>

      {/* Patient Records */}
      <div className="admin-show-patient__medications">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3 className="admin-show-patient__subheading">Medical Records</h3>
          <button className="admin-show-patient__add-button" onClick={()=>{nav(`/add-record?patientId=${patientId}`)}}>+</button>
        </div>
        
        <div className="admin-show-patient__scroll">
          {patient.list?.length > 0 ? (
            <ul>
              {patient.list.map((record, index) => (
                <li key={index}>
                  <Link
                    to={`/admin/showRecord?patientId=${patient._id}&recordId=${record._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {" "}
                    <strong>{record.title || `Record ${index + 1}`}</strong><Link to={`/edit-record/${record._id}?patientId=${patient._id}`}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></Link>
                    Date:{" "}
                    {record.date
                      ? new Date(record.date).toLocaleDateString()
                      : "N/A"}
                    <br />
                    {record.diagnosis && <span>{record.diagnosis}</span>}
                    <br />
                    {record.notes && <span>{record.notes}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No medical records available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminShowPatient;
