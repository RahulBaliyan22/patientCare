import React, { useState } from "react";
import axios from "axios";
import "./AddRecord.css";
import { useNavigate,useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddRecord = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");


  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    doctor: "",
    diagnosis: "",
    notes: "",
    isScript:false
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setRecord((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create previews for the selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.doctor) {
      toast.error("Date and Doctor are required fields.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("date", formData.date);
    data.append("doctor", formData.doctor);
    data.append("diagnosis", formData.diagnosis);
    data.append("notes", formData.notes);
    data.append("isScript",formData.isScript)

    images.forEach((image) => {
      data.append("images", image); // Send images directly
    });

    try {
      if(!patientId){
      const response = await axios.post(
        "https://patientcare-2.onrender.com/add-record", 
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      setLoading(false);

      // Clear the form
      setFormData({
        date: "",
        doctor: "",
        diagnosis: "",
        notes: "",
        isScript:false
      });
      setImages([]);
      setImagePreviews([]);
      navigation("/records");}else{
        const resp = await axios.post(`https://patientcare-2.onrender.com/admin/add-record/${patientId}`,data,{withCredentials:true})
        toast.success(resp.data.message);
        setLoading(false);
  
        // Clear the form
        setFormData({
          date: "",
          doctor: "",
          diagnosis: "",
          notes: "",
          isScript:false
        });
        setImages([]);
        setImagePreviews([]);
        navigation(`/admin/showpatient?patientId=${patientId}`)
      }
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to add record.");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="medication-form">
        <h2>Add Medical Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="doctor" className="form-label">Doctor</label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              placeholder="Enter doctor's name"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="diagnosis" className="form-label">Diagnosis</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              placeholder="Enter diagnosis (optional)"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional notes"
              className="form-textarea"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="images" className="form-label">Upload Images</label>
            <em>For multiple uploads, hold Ctrl and select images</em>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="form-input"
            />
          </div>
          {!patientId && <div className="form-group">
            <label htmlFor="isScript" className="form-label">Want Analysis For Record : </label>
            <input
              type="checkbox"
              id="is"
              name="isScript"
              checked={formData.isScript}
              onChange={handleInputChange}
              className="form-input"
              style={{width:"20px"}}
            />
          </div>}
          {/* Display image previews */}
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="image-preview"
                />
              ))}
            </div>
          )}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Add Record"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecord;