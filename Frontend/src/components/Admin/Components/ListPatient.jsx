import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import '../Components/Styles/PatientList.css';
import { Link } from 'react-router-dom';
import ReloadContext from '../../../util/ReloadContext';
function ListPatient() {
  const [patients, setPatients] = useState([]);
  const { reload } = useContext(ReloadContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get('https://patientcare-2.onrender.com/admin/getpatients', { withCredentials: true });
        console.log(resp);
        setPatients(resp?.data || []);
      } catch (e) {
        console.error('Error fetching patients:', e);
      }
    };
    fetchData();
  }, [reload]);

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
              <td>
                <Link to={`/admin/showpatient/${patient._id}`} style={{ textDecoration: "none", color: "blue" }}>
                  {patient?.uid || "not a valid patient"}
                </Link>
              </td>
              <td>
                <Link to={`/admin/showpatient/${patient._id}`} style={{ textDecoration: "none", color: "blue" }}>
                  {patient?.name || 'Unknown'}
                </Link>
              </td>
              <td>
                <Link to={`/admin/showpatient/${patient._id}`} style={{ textDecoration: "none", color: "blue" }}>
                  {patient?.age ?? 'Not Provided'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPatient;
