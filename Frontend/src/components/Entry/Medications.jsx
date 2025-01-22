import React, { useState, useEffect, useContext } from "react";
import "./Medications.css"; // Import styling for the medications page
import { AuthContext } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
import axios from "axios";

const Medications = () => {
  const [orgMed, setOrgMed] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(true);
  const [isNotActive, setIsNotActive] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn || !localStorage.getItem("user")) {
      navigate("/login");
      setIsLoggedIn(false);
      toast.success("Log in first");
    }
  }, [navigate]);

  const handleIsActive = async (e) => {
    let update;

    if (!isActive == false && isNotActive == true) {
      update = orgMed.filter((med) => {
        if (med.isEnd) {
          return true;
        } else {
          return false;
        }
      });
      setMedications(update);
    } else if (!isActive == false && isNotActive == false) {
      toast.info("Result: will be Empty, please choose the correct option");
    } else if (!isActive == true && isNotActive == false) {
      update = orgMed.filter((med) => {
        if (!med.isEnd) {
          return true;
        } else {
          return false;
        }
      });
      setMedications(update);
    } else if (!isActive == true && isNotActive == true) {
      setMedications(orgMed);
    }

    setIsActive(!isActive);
  };
  const handleIsNotActive = async () => {
    let update;
    if (!isNotActive == false && isActive == true) {
      update = orgMed.filter((med) => {
        if (!med.isEnd) {
          return true;
        } else {
          return false;
        }
      });
      setMedications(update);
    } else if (!isNotActive == false && isActive == false) {
      toast.info("Result: will be Empty, please choose the correct option");
    } else if (!isNotActive == true && isActive == false) {
      update = orgMed.filter((med) => {
        if (med.isEnd) {
          return true;
        } else {
          return false;
        }
      });
      setMedications(update);
    } else if (!isNotActive == true && isActive == true) {
      setMedications(orgMed);
    }
    setIsNotActive(!isNotActive);
  };

  const handleEnd = async (e, id) => {
    e.preventDefault();

    const updatedMedications = orgMed.map((med) =>
      med._id === id
        ? {
            ...med,
            end: new Date().toISOString().split("T")[0],
            isEnd: true,
          }
        : med
    );

    setOrgMed(updatedMedications);

    console.log(updatedMedications);
    setMedications(updatedMedications);

    try {
      const response = await axios.patch(
        `http://localhost:8000/med/end/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success(response.data.message);
    } catch (e) {
      console.error(e);
      toast.error("Error occurred while updating the medication.");
    }
  };

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axios.get("http://localhost:8000/med", {
          withCredentials: true,
        });
        setOrgMed(response.data.med);
        setMedications(response.data.med);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);


  const handleMedDelete = async(id)=>{


    const up = orgMed.filter((med)=>{
      if(med._id === id){
        return false;
      }else{
        return true;
      }
    })

    setOrgMed(up)
    setMedications(up)
    try{
      const response = await axios.delete(`http://localhost:8000/med/delete/${id}`,{withCredentials:true})
      toast.success("Deleted successfully");
    }catch(e){
      toast.error("error");
    }
  }
  const handleMedUpdate = async(id)=>{
    navigate(`/medications/update/${id}`)
  }
  return (
    <div className="medications-container">
      <h1 className="medications-title">Your Medication History</h1>
      <div className="cheLo">
        <div className="chelo-btn1">
          <label htmlFor="1" style={{ cursor: "pointer" }}>
            Active Medications
          </label>{" "}
          <input
            type="checkbox"
            id="1"
            name="isActive"
            value={isActive}
            onChange={handleIsActive}
            defaultChecked={isActive}
          />
        </div>
        <div className="chelo-btn1">
          <label htmlFor="2" style={{ cursor: "pointer" }}>
            Stopped Medications
          </label>{" "}
          <input
            type="checkbox"
            id="2"
            name="isNotActive"
            value={isNotActive}
            onChange={handleIsNotActive}
            defaultChecked={isNotActive}
          />
        </div>
      </div>
      {loading ? (
       <>
       <div className="sp" > 
     </div>
     <p>Loading Records...</p></>
      ) : medications.length === 0 ? (
        <p className="no-medications-text">
          No medications found in your history.
          <button
            onClick={() => {
              navigate("/medications/add");
            }}
            style={{
              backgroundColor: "green",
              width: "200px",
              cursor: "pointer",
              color: "white",
            }}
          >
            Add Medication history
          </button>
        </p>
      ) : (
        <table className="medications-table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Prescribed By</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Dosage</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {isActive &&
              medications.map(
                (med) =>
                  !med.isEnd && ( // Use conditional rendering
                    
                    <tr key={med._id}>
                      <td>{med.name}</td>
                      <td>{med.prescribedBy}</td>
                      <td>{new Date(med.start).toISOString().split("T")[0]}</td>
                      <td>
                        {med.end ? (
                          new Date(med.end).toISOString().split("T")[0]
                        ) : (
                          <>
                            Still Going On ..
                            <button
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                              }}
                              onClick={(e) => handleEnd(e, med._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="40px"
                                viewBox="0 -960 960 960"
                                width="40px"
                                fill="#004d4d"
                              >
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240h-80v-240H160v480h400v80H160Zm398-225L440-503v89h-80v-226h226v80h-90l118 118-56 57Zm202 225q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        {med.dosage || "--"}
                      </td>
                        <td style={{display:"flex"}}>
                          <div className="btn-new" ><svg  onClick={()=>{handleMedUpdate(med._id)}} xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#004d4d"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></div>
                          <div className="btn-new"><svg onClick={()=>{handleMedDelete(med._id)}} xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="red"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>
                        </td>
                        
                    </tr>
                    
                  )
              )
            }
            {isNotActive && medications.map((med)=>
            med.isEnd && (
              <tr key={med._id}>
                      <td>{med.name}</td>
                      <td>{med.prescribedBy}</td>
                      <td>{new Date(med.start).toISOString().split("T")[0]}</td>
                      <td>
                        {med.end ? (
                          new Date(med.end).toISOString().split("T")[0]
                        ) : (
                          <>
                            Still Going On ..
                            <button
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                              }}
                              onClick={(e) => handleEnd(e, med._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="40px"
                                viewBox="0 -960 960 960"
                                width="40px"
                                fill="#004d4d"
                              >
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240h-80v-240H160v480h400v80H160Zm398-225L440-503v89h-80v-226h226v80h-90l118 118-56 57Zm202 225q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </td>
                      <td>{med.dosage || "--"}</td>
                      <td style={{display:"flex"}}>
                      <div className="btn-new" ><svg  onClick={()=>{handleMedUpdate(med._id)}} xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#004d4d"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></div>
                      <div className="btn-new"><svg onClick={()=>{handleMedDelete(med._id)}} xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="red"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>
                        </td>
                    </tr>
            )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Medications;
