import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../pages/Styles/AdminShowpatient.css";

const AdminShowPatient = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`https://patientcare-2.onrender.com/admin/getpatient/${id}`,{withCredentials:true});
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

  if (loading) return <div className="admin-show-patient__loading">Loading patient data...</div>;
  if (error) return <div className="admin-show-patient__error">{error}</div>;

  return (
    <div className="admin-show-patient">
      <h2 className="admin-show-patient__heading">Patient Details</h2>

      <div className="admin-show-patient__details">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
      </div>

      {/* Active Medications */}
      <div className="admin-show-patient__medications">
        <h3 className="admin-show-patient__subheading">Active Medications</h3>
        <div className="admin-show-patient__scroll">
          {patient.med?.filter(med => !med.isEnd).length > 0 ? (
            <ul>
              {patient.med.filter(med => !med.isEnd).map((med, index) => (
                <li key={index}>
                  <strong>{med.name}</strong> ({med.dosage || "N/A"})<br />
                  Start: {new Date(med.start).toLocaleDateString()}
                  {med.prescribedBy && <> | Prescribed by: {med.prescribedBy}</>}
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
        <h3 className="admin-show-patient__subheading">Non-Active Medications</h3>
        <div className="admin-show-patient__scroll">
          {patient.med?.filter(med => med.isEnd).length > 0 ? (
            <ul>
              {patient.med.filter(med => med.isEnd).map((med, index) => (
                <li key={index}>
                  <strong>{med.name}</strong> ({med.dosage || "N/A"})<br />
                  Start: {new Date(med.start).toLocaleDateString()} — End:{" "}
                  {med.end ? new Date(med.end).toLocaleDateString() : "N/A"}
                  {med.prescribedBy && <> | Prescribed by: {med.prescribedBy}</>}
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
  <h3 className="admin-show-patient__subheading">Medical Records</h3>
  <div className="admin-show-patient__scroll">
    {patient.records?.length > 0 ? (
      <ul>
        {patient.records.map((record, index) => (
          <li key={index}>
            <strong>{record.title || `Record ${index + 1}`}</strong><br />
            Date: {record.date ? new Date(record.date).toLocaleDateString() : "N/A"}<br />
            {record.diagnosis && <span>{record.diagnosis}</span>}<br />
            {record.notes && <span>{record.notes}</span>}

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
