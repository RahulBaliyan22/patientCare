import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./EditRecord.css";
import { toast } from 'react-toastify';

const EditRecord = () => {
  const { id } = useParams(); // Get the record ID from the URL
  const navigate = useNavigate(); // For navigation
  const [sR] = useSearchParams();
  const patientId = sR.get("patientId");
  const [record, setRecord] = useState({
    date: "",
    doctor: "",
    diagnosis: "",
    notes: "",
    image: [],
    isScript:false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews for the selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Fetch the record details to pre-fill the form
  useEffect(() => {
    const fetchRecordDetails = async () => {
      try {
        if(patientId){
          const response = await axios.get(`https://patientcare-2.onrender.com/admin/get-record/${id}`, {
            withCredentials: true,
          });
          setRecord({
            date: response.data.record.date.slice(0, 10), // Format date for input
            doctor: response.data.record.doctor,
            diagnosis: response.data.record.diagnosis || "",
            notes: response.data.record.notes || "",
            image: response.data.record.image || [],
          });
          setLoading(false);
        }else{
          const response = await axios.get(`https://patientcare-2.onrender.com/records/${id}`, {
            withCredentials: true,
          });
          setRecord({
            date: response.data.record.date.slice(0, 10), // Format date for input
            doctor: response.data.record.doctor,
            diagnosis: response.data.record.diagnosis || "",
            notes: response.data.record.notes || "",
            image: response.data.record.image || [],
          });
          setLoading(false);
        }
        
      } catch (err) {
        console.error("Error fetching record details:", err);
        setError(err.response?.data?.message || "Failed to load record.");
        setLoading(false);
      }
    };

    fetchRecordDetails();
  }, [id]);

  const handleImageDelete = async (e, filePath) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://patientcare-2.onrender.com/delete-image/${id}`, {
        data: { filePath },
        withCredentials: true,
      });
      // Update state after successful deletion (optionally fetch the record again or update the image array)
      setRecord((prevRecord) => ({
        ...prevRecord,
        image: prevRecord.image.filter((img) => img.filePath !== filePath),
      }));
      toast.success(response.data.message); // Success message
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('date', record.date);
    formData.append('doctor', record.doctor);
    formData.append('diagnosis', record.diagnosis);
    formData.append('notes', record.notes);
    formData.append('isScript',record.isScript)
    // Append images
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      if(!patientId){
      const response = await axios.put(
        `https://patientcare-2.onrender.com/records/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      navigate("/records");}else{
        const response = await axios.put(
          `https://patientcare-2.onrender.com/admin/update-record/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        navigate(`/admin/showpatient?patientId=${patientId}`);
      }
      toast.success("Record Updated");
    } catch (err) {
      console.error("Error updating record:", err);
      toast.error(err.response?.data?.message || "Failed to update the record.");
      setError(err.response?.data?.message || "Failed to update the record.");
    }
  };

  return (
    <div className="edit-record-container">
      {loading ? (
         <>
         <div className="sp" > 
       </div>
       <p>Loading Records...</p></>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-record-form">
          <h2>Edit Record</h2>
          
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={record.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="doctor">Doctor:</label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              value={record.doctor}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis:</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={record.diagnosis}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={record.notes}
              onChange={handleChange}
            />
          </div>

          {/* Images (View Only, Modification Requires Separate Handling) */}
          <div className="form-group">
            <label>Uploaded Images:</label>
            <div className="image-list">
              {record.image.map((img, index) => (
                <div key={index} className="imageLink">
                  <a
                    href={img.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ImL"
                  >
                    {img.filename}
                  </a>
                  <button onClick={(e) => handleImageDelete(e, img.filePath)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2854C5">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="images">Upload Images</label>
              <em>Hold ctrl to select multiple images</em>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
            {!patientId && <div className="form-group">
            <label htmlFor="isScript" className="form-label">Want Analysis For Record : </label>
            <input
              type="checkbox"
              id="is"
              name="isScript"
              checked={record.isScript}
              onChange={handleChange}
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
          </div>
          <button type="submit" className="submit-btn">
            {loading ? `Updating Please wait few seconds`: `Update Record`}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/records")}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default EditRecord;
