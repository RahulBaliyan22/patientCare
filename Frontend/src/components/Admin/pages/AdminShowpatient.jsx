import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../pages/Styles/AdminShowpatient.css';

function AdminShowpatient() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `https://patientcare-2.onrender.com/admin/getpatient/${patientId}`,
          { withCredentials: true }
        );
        setPatient(resp?.data?.patient);
      } catch (e) {
        console.error("Error fetching patient:", e);
        setError("Failed to load patient details. Please try again.");
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  if (error)
    return <div className="admin-show-patient__error">{error}</div>;

  if (!patient)
    return <div className="admin-show-patient__loading">Loading patient info...</div>;

  return (
    <div className="admin-show-patient">
      <h2 className="admin-show-patient__heading">Patient Details</h2>
      <div className="admin-show-patient__details">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
        <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
        <p><strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}</p>
        <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>

        <div className="admin-show-patient__medications">
          <strong>Medications:</strong>
          {patient.med?.length > 0 ? (
            <ul>
              {patient.med.map((med, index) => (
                <li key={index}>
                  {typeof med === 'string' ? med : med.name || 'Unnamed medication'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No medications listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminShowpatient;
