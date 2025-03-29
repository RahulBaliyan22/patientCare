import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "react-toastify";
import "./ViewRecord.css";

const ViewRecord = () => {
  const { id } = useParams(); // Extract record ID from URL
  const navigate = useNavigate(); // For navigation

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [primary, setPrimary] = useState({});
  const [showContactsSelect, setShowContactsSelect] = useState(false);

  const [sendList, setSendList] = useState([]);

  // Fetch record details
  const fetchRecordDetails = async () => {
    try {
      const response = await axios.get(
        `https://patientcare-2.onrender.com/records/${id}`,
        { withCredentials: true }
      );

      const { record, contacts, primary } = response.data;

      setRecord(record);
      setContacts(contacts);
      if (primary.isPrimary) {
        setPrimary(primary.primaryContact);
        setSendList([primary.primaryContact]);
      }
      console.log(record);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching record details:", err);
      setError(err.response?.data?.message || "Failed to load record details.");
      setLoading(false);
    }
  };

  // Delete record
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://patientcare-2.onrender.com/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/records");
    } catch (e) {
      console.error(e);
      toast.error("Error deleting the record. Please try again.");
    }
  };

  // Send email
  const handleSend = async () => {
    try {
      const response = await axios.post(
        `https://patientcare-2.onrender.com/record/send-email/${id}`,
        { contacts: sendList },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send the email.");
    }
  };

  // Handle checkbox selection
  const handleChange = (e, contact) => {
    if (e.target.checked) {
      setSendList((prev) => [...prev, contact]);
    } else {
      setSendList((prev) => prev.filter((c) => c._id !== contact._id));
    }
  };

  // Navigation handlers
  const handleBackClick = () => navigate("/records");
  const handleEditClick = () => navigate(`/edit-record/${id}`);
  

  useEffect(() => {
    fetchRecordDetails();
  }, [id]);

  return (
    <div className="view-record-container">
      {loading ? (
        <div>
          <div className="sp"></div>
          <p>Loading Records...</p>
        </div>
      ) : error ? (
        <div className="error-container">{error}</div>
      ) : (
        <div>
          {/* Navigation buttons */}
          <div className="button-container">
          <button className="go-back" onClick={handleBackClick}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                width="40px"
                fill="#004d4d"
              >
                <path d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z" />
              </svg>
            </button>
            <button className="share-btn" onClick={handleEditClick}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#004d4d"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </button>
          
            <button
              onClick={()=>{setShowContactsSelect(true)}}
              className="share-btn"
              title="Share Report"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                width="40px"
                fill="#2854C5"
              >
                <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
              </svg>
            </button>
          </div>

          {/* Record details */}
          <div className="record-details">
            <h2 className="record-title">Patient Record Details</h2>
            <div className="record-info">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(record.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Doctor:</strong> {record.doctor || "Not provided"}
              </p>
              <p>
                <strong>Diagnosis:</strong> {record.diagnosis || "Not provided"}
              </p>
              <p>
                <strong>Notes:</strong> {record.notes || "No additional notes"}
              </p>
            </div>

            {/* Images */}
            {record.image && record.image.length > 0 ? (
              <PhotoProvider
              pullClosable={true}
              maskClosable={true}
              maskOpacity={0.6}
              toolbarRender={({ onScale, scale, rotate, onRotate }) => {
                return (
                  <div className="custom-toolbar">
                    {/* Zoom In Button */}
                    <button
                      className="toolbar-btn"
                      title="Zoom In"
                      onClick={() => onScale(scale + 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill="#FFFFFF"
                      >
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
                      </svg>
                    </button>

                    {/* Zoom Out Button */}
                    <button
                      className="toolbar-btn"
                      title="Zoom Out"
                      onClick={() => onScale(scale - 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill="#FFFFFF"
                      >
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z" />
                      </svg>
                    </button>

                    {/* Reset Zoom Button */}
                    <button
                      className="toolbar-btn"
                      title="Reset Zoom"
                      onClick={() => onScale(1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill="#2854C5"
                      >
                        <path d="M120-586.67V-820h66.67v132q48.66-69.33 125.5-110.67Q389-840 480-840q124.67 0 219.5 72.67 94.83 72.66 126.5 180.66h-70.33q-30.67-80-105-133.33-74.34-53.33-170.67-53.33-73 0-134.17 32.66-61.16 32.67-100.5 87.34h108v66.66H120ZM237.33-238h486l-148-197.33-128 167.33-92-124.67-118 154.67ZM186.67-80Q159-80 139.5-99.5T120-146.67v-346.66h66.67v346.66h586.66v-346.66H840v346.66q0 27.67-19.5 47.17T773.33-80H186.67Z" />
                      </svg>
                    </button>

                    {/* Rotate Button */}
                    <button
                      className="toolbar-btn"
                      title="Rotate"
                      onClick={() => onRotate(rotate - 90)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill="#2854C5"
                      >
                        <path d="M436.67-80q-48.67-6.33-94-24.83-45.34-18.5-86-49.17L304-202.67q31 23 64.5 36.34 33.5 13.33 68.17 19V-80Zm86.66 0v-67.33q108-19 179-100.17t71-193.83q0-123.67-84.83-208.5-84.83-84.84-208.5-84.84h-16l74 74-48 48L334.67-768 490-923.33l48 48.66-73.33 73.34H480q75 0 140.5 28.16 65.5 28.17 114.33 77 48.84 48.84 77 114.34Q840-516.33 840-441.33q0 139-89.67 240.16Q660.67-100 523.33-80Zm-328-135.33Q166-254.67 147.17-301q-18.84-46.33-25.17-97h68q5 36.67 18.33 70.83Q221.67-293 244-263.33l-48.67 48ZM122-484.67Q128.67-535 147-581t48.33-85.67L244-619.33q-22.33 31.66-35.67 65.83Q195-519.33 190-484.67h-68Z" />
                      </svg>
                    </button>
                    <button
                      className="toolbar-btn"
                      title="Rotate"
                      onClick={() => onRotate(rotate + 90)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill="#2854C5"
                      >
                        <path d="M525.33-80v-67.33q34.67-5.67 68.17-19 33.5-13.34 64.5-36.34L705.33-154q-40.66 30.67-86 49.17-45.33 18.5-94 24.83Zm-86.66 0q-137.34-20-227-121.17Q122-302.33 122-441.33q0-75 28.17-140.5 28.16-65.5 77-114.34Q276-745 341.5-773.17 407-801.33 482-801.33h15.33L424-874.67l48-48.66L627.33-768 472-612.67l-48-48 74-74h-16q-123.67 0-208.5 84.84-84.83 84.83-84.83 208.5 0 112.66 71 193.83 71 81.17 179 100.17V-80Zm328-135.33-48.67-48q22.33-29.67 35.67-63.84Q767-361.33 772-398h68q-6.33 50.67-25.17 97-18.83 46.33-48.16 85.67ZM840-484.67h-68q-5-34.66-18.33-68.83-13.34-34.17-35.67-65.83l48.67-47.34Q796.67-627 815-581t25 96.33Z" />
                      </svg>
                    </button>
                  </div>
                );
              }}
           >
                <div className="gallery-container">
                  {record.image.map((img, index) => (
                    <PhotoView
                      key={index}
                      src={img.filePath}
                    >
                      <img
                        src={img.filePath}
                        alt={`Image ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </PhotoView>
                  ))}
                </div>
              </PhotoProvider>
            ) : (
              <p>No images available.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation popup */}
      {showDeleteConfirmation ? (
        <div className="delete-popup">
          <p>Are you sure you want to delete this record?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowDeleteConfirmation(false)}>No</button>
        </div>
      ):( 
        <button
          className="delete-btn"
          onClick={() => setShowDeleteConfirmation(true)}
          title="Delete Report"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="red"
          >
            <path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" />
          </svg>
        </button>
      )}

      {/* Share contacts selection */}
      {showContactsSelect && (
        <div className="pick">
          {primary && primary.isVerified ? (
            <div>
              <h5>Primary Contact</h5>
              <p>Name: {primary.name}</p>
              <p>Email: {primary.email}</p>
              <input
                type="checkbox"
                onChange={(e) => handleChange(e, primary)}
                defaultChecked
              />
            </div>
          ) : (
            <p>No primary contact set.</p>
          )}

          {contacts.map(
            (item, idx) =>
              item.isVerified &&
              !item.isPrimary && (
                <div key={item._id} className="contact-item">
                  <h5>Contact {idx + 1}</h5>
                  <p>Name: {item.name}</p>
                  <p>Email: {item.email}</p>
                  <input
                    type="checkbox"
                    onChange={(e) => handleChange(e, item)}
                  />
                </div>
              )
          )}

          <button className="sub" onClick={handleSend}>
            Send
          </button>
          <button
            className="can"
            onClick={() => setShowContactsSelect(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewRecord;
