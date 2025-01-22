import React, { useState } from "react";
import "./Timeline.css";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
import {Link} from 'react-router-dom'
const Timeline = ({ history, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentEvents = history.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="horizontal-timeline-container">
      <h1 className="timeline-title">Your Medical History</h1>
      {history.length > 0 ? (
        <div>
          <div className="timeline-wrapper">
            <div className="timeline">
              {currentEvents.map((event, index) => (
                <div key={index} className="timeline-event">
                  <Link to={`/view-record/${event._id}`} className="timeline-event">
                  <div className="timeline-dot"></div>
                  <div className="timeline-card">
                    <p className="timeline-date">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <h3 className="timeline-title">{event.doctor}</h3>
                    <em>{event.diagnosis}</em>
                    <p className="timeline-description">{event.note}</p>
                  </div>
                  </Link>
                  {index < currentEvents.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="timeline-pagination">
            <button
              className="pagination-btn"
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >
              Previous <br />
              &larr;
            </button>
            <span className="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
            >
              Next <br />
              &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="timeline-start-message">
          <h2 style={{textAlign:"center"}}>Start your timeline , make an entry record</h2>
          <p style={{ textAlign: "center" }}>
            There are no records to display yet. Please make your first entry to
            begin.
          </p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
