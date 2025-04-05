import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Components/Styles/PatientList.css';

function ListPatient() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get('https://patientcare-2.onrender.com/admin/getpatients',{withCredentials:true});
        console.log(resp)
        setPatients(resp?.data || []);
      } catch (e) {
        console.error('Error fetching patients:', e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="patient-container">
      <h2 className="patient-title">Registered Patients</h2>
      <p className="patient-count">Total Patients: {patients.length}</p>
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient?.uid || "not a valid patient"}</td>
              <td>{patient?.name || 'Unknown'}</td>
              <td>{patient?.age ?? 'Not Provided'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPatient;
