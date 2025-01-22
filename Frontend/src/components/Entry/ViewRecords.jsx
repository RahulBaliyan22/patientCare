import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import "./ViewRecords.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../main";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PickContacts from "./PickContacts";

const ViewRecords = () => {
  const [contacts,setContacts] =useState([])//
  const [primary,setPrimary] = useState({})//

  const [showContactsSelect,setShowContactsSelect]=useState(false);
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Month is zero-indexed, so +1
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Get current year
  const radioRef = useRef();
  const [isSet, setIsSet] = useState(false); // Initial state is false, which means filter is active
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleRowClick = (recordId) => {
    navigate(`/view-record/${recordId}`);
  };

  const handleMonthChange = (e) => {
    const query = e.target.value;
    setSelectedMonth(query);
  };

  const handleYearChange = (e) => {
    const query = e.target.value;
    setSelectedYear(query);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Function to handle checkbox change
  const handleRange = (e) => {
    setIsSet(e.target.checked); // Set isSet to true or false based on checkbox state
  };

  // UseMemo to filter the records based on search, month, and year
  const filteredRecords = useMemo(() => {
    // If isSet is true, return all records without applying filters
    if (isSet) {
      return records;
    }
    
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      const recordMonth = recordDate.getMonth() + 1; // Adjust for zero-indexed month
      const recordYear = recordDate.getFullYear();

      return (
        (record.doctor?.toLowerCase().includes(searchQuery) ||
          record.diagnosis?.toLowerCase().includes(searchQuery) ||
          record.notes?.toLowerCase().includes(searchQuery)) &&
        (selectedMonth ? recordMonth === parseInt(selectedMonth) : true) &&
        (selectedYear ? recordYear === parseInt(selectedYear) : true)
      );
    });
  }, [searchQuery, selectedMonth, selectedYear, records, isSet]);

  // Check user authentication on component mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!isLoggedIn && !user) {
      setIsLoggedIn(false);
      toast.warning("Please log in first.");
      navigate("/login");
    } else if (user) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, navigate, setIsLoggedIn]);

  

  

  // Fetch records from the server
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8000/records", {
          withCredentials: true,
        });
        setContacts(response.data.contacts);
        if(response.data.primary.isPrimary){
          setPrimary(response.data.primary.primaryContact);
        }
        setRecords(response.data.records);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError("Failed to load records. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="records-container">
      <div className="header">
        <h1 className="records-title">Patient Records</h1>
        
        <button onClick={()=>{setShowContactsSelect(true)}} className="share-btn2" title="Share All Reports"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#2854C5"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
        <div className="labche">
          <label htmlFor="is" className="lab">View All Records</label>
          <input
            className="che"
            type="checkbox"
            onChange={handleRange}
            ref={radioRef}
            defaultChecked={isSet}
            id="is"
          />
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-container">
        <div className="search-bar-container" style={{ width: "20vw" }}>
          <input
            type="text"
            placeholder="Search by doctor, diagnosis, or notes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            disabled={isSet}
          />
        </div>

        <div className="filter-dropdowns">
          {/* Month Dropdown */}
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-dropdown"
            disabled={isSet} // Disable month dropdown if isSet is true
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          {/* Year Input */}
          <input
            type="number"
            placeholder="Year"
            value={selectedYear}
            onChange={handleYearChange}
            className="year-input"
            disabled={isSet} // Disable year input if isSet is true
          />
        </div>
        
      </div>

      {loading ? (
        <>
       <div className="sp" > 
     </div>
     <p>Loading Records...</p></>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : filteredRecords.length === 0 ? (
        <p className="no-records-text">No records found.</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr
                key={record._id}
                onClick={() => handleRowClick(record._id)}
                style={{ cursor: "pointer" }}
                className="rowChe"
              >
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.doctor || "-"}</td>
                <td>{record.diagnosis || "-"}</td>
                <td>{record.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  {showContactsSelect &&
  
      (
      <PickContacts contacts={contacts} primary ={primary} setShowContactsSelect={setShowContactsSelect} filteredRecords={filteredRecords}/>)

  }
    </div>
  );
};

export default ViewRecords;
