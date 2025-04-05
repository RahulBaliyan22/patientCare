import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../Components/Styles/PatientItem.css';
import ReloadContext from '../../../util/ReloadContext';

function PatientItem({ patient, isAdded }) {
  const [isAdd, setIsAdd] = useState(isAdded);
  const { reload, setReload } = useContext(ReloadContext);
  const handleClick = async () => {
    try {
      const resp = await axios.post(
        `https://patientcare-2.onrender.com/admin/add-patient?patientId=${patient._id}`,
        {},
        { withCredentials: true }
      );
      setIsAdd(true);
      setReload(!reload)
      toast.success(resp?.data?.message || 'Patient added successfully!');
    } catch (e) {
      console.error('Error:', e);
      toast.error(e?.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="listContainer">
      <div className="contentContainer">
        {patient.name}
      </div>
      <div className="btnContainer">
        <button>
          <Link to={`/admin/showpatient/${patient._id}`}>View Patient</Link>
        </button>
        {!isAdd && (
          <button onClick={handleClick}>
            Add Patient
          </button>
        )}
      </div>
    </div>
  );
}

export default PatientItem;
