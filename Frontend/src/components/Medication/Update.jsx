import React, { useState, useEffect } from "react";
import "./Create.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const Update = () => {
  const navigate = useNavigate();
  const [sR] = useSearchParams();
  const patientId = sR.get("patientId");
  const { id } = useParams(); // Get the medication ID from the URL if it exists

  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    prescribedBy: "",
    dosage: "",
  });

  // Fetch existing medication data if an ID is provided (for editing)
  useEffect(() => {
    const fetchMedication = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `https://patientcare-2.onrender.com/med/${id}`,
            { withCredentials: true }
          );
          const medication = response.data.medication;
          const formatDOB = medication.start
            ? new Date(medication.start).toISOString().split("T")[0]
            : "";
          const formatDOB2 = medication.end
            ? new Date(medication.end).toISOString().split("T")[0]
            : "";
          setFormData({
            name: medication.name || "",
            start: formatDOB,
            end: formatDOB2,
            prescribedBy: medication.prescribedBy || "",
            dosage: medication.dosage || "",
          });

          toast.success(response.data.message);
        } catch (error) {
          console.error("Error fetching medication data:", error);
          toast.error("Failed to load medication details.");
        }
      }
    };

    fetchMedication();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, start } = formData;

    // Validate required fields
    if (!name || !start) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      if (!patientId) {
        // Update existing medication
        const response = await axios.patch(
          `https://patientcare-2.onrender.com/med/update/${id}`,
          formData,
          { withCredentials: true }
        );
        toast.success(response.data.message);

        // Navigate back to the medication list and reset the form
        navigate("/medications");
      } else {
        const response = await axios.patch(
          `https://patientcare-2.onrender.com/admin/update-Med/${id}`,
          formData,
          { withCredentials: true }
        );
        toast.success(response.data.message);

        // Navigate back to the medication list and reset the form
        navigate(`/admin/showpatient?patient=${patientId}`);
      }
      setFormData({
        name: "",
        start: "",
        end: "",
        prescribedBy: "",
        dosage: "",
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("An error occurred!");
    }
  };

  return (
    <div className="page-container">
      <form className="medication-form" onSubmit={handleSubmit}>
        <h2>Update Medication</h2>

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
          Update Medication
        </button>
      </form>
    </div>
  );
};

export default Update;
