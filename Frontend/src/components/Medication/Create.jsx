import React, { useState } from "react";
import "./Create.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
const Create = () => {
  const [sR] = useSearchParams();
  const patientId = sR.get("patientId");
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    prescribedBy: "",
    dosage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, start,end } = formData;
    if (!name || !start) {
      toast.error("Please fill in all required fields!");
      return;
    }
    if (end) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
    
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);
    
      if (endDate < startDate) {
        toast.error("Error: End date should be greater than or equal to start date!");
        return;
      }
    }
    try {
      if(!patientId){
      const response = await axios.post(`https://patientcare-2.onrender.com/med`,formData,{withCredentials: true})

      
        navigate('/medications')}else{
          const response = await axios.post(`https://patientcare-2.onrender.com/admin/add-Med/${patientId}`,formData,{withCredentials: true})
          navigate(`/admin/showpatient?patientId=${patientId}`) 
        }
        toast.success(response.data.message)
        setFormData({
          name: "",
          start: "",
          end: "",
          prescribedBy: "",
          dosage: "",
    })
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("An error occurred!")
      
    }
  };

  return (
    <div className="page-container">
      <form className="medication-form" onSubmit={handleSubmit}>
        <h2>Medication Form</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Medication Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter medication name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="start">
            Start Date <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-input"
            type="date"
            id="start"
            name="start"
            value={formData.start}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="end">
            End Date
          </label>
          <input
            className="form-input"
            type="date"
            id="end"
            name="end"
            value={formData.end}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prescribedBy">
            Prescribed By
          </label>
          <input
            className="form-input"
            type="text"
            id="prescribedBy"
            name="prescribedBy"
            value={formData.prescribedBy}
            onChange={handleChange}
            placeholder="Enter doctor's name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dosage">
            Dosage
          </label>
          <input
            className="form-input"
            type="text"
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Enter dosage details"
          />
        </div>

        <button className="submit-button" type="submit">
          Submit
        </button>

        
      </form>
    </div>
  );
};

export default Create;
