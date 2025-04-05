import React from 'react';
import '../Components/Styles/PatientList.css';

function ListPatient() {
  const patients = [
    { id: 1, name: 'John Doe', age: 45, status: 'critical' },
    { id: 2, name: 'Jane Smith', age: 38, status: 'stable' },
    { id: 3, name: 'Emily Johnson', age: 29, status: 'recovering' },
    { id: 4, name: 'Michael Brown', age: 60, status: 'stable' }
  ];

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
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td className={`condition-${patient.status}`}>{patient.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPatient;
