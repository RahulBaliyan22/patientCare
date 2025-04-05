import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../Components/Styles/SearchCss.css';
import PatientItem from './PatientItem';

function Search({setReload,reload}) {
  const [patient, setPatient] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const inputRef = useRef();

  const handleSearch = async () => {
    const query = inputRef.current.value;
    if (!query) return;
    try {
      const resp = await axios.get(
        `https://patientcare-2.onrender.com/admin/getpatient/me?patientId=${query}`,
        { withCredentials: true }
      );
      setPatient(resp?.data?.patient);
      setIsAdded(resp?.data?.isAdded);
      setReload(!reload);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='searchContainer'>
      <input
        className='query'
        type='text'
        ref={inputRef}
        onKeyDown={handleSubmit}
        placeholder='Search patient by ID...'
      />
      <div className='result'>
        {patient && <PatientItem patient={patient} isAdded={isAdded} />}
      </div>
    </div>
  );
}

export default Search;
