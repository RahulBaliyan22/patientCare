import React, { useEffect, useState } from "react";
import "./NewCSS.css";
function NewComponents() {
  const [newState, setNewState] = useState({
    appUpdates: [],
    healthSectorNews: [],
  });

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let data = {
      appUpdates: [
        {
          title: "New Feature: Live Health Monitoring",
          description: "Track your vitals in real-time with our new WebSocket-based monitoring feature.",
          link: "https://yourapp.com/live-monitoring",
          date: "2025-04-03",
        },
        {
          title: "Improved UI for Health Dashboard",
          description: "Experience a cleaner, more user-friendly interface for managing your records.",
          link: "https://yourapp.com/dashboard-update",
          date: "2025-03-28",
        },
        {
          title: "Secure Cloud Storage for Medical Records",
          description: "Now store your medical records securely with Amazon S3 integration.",
          link: "https://yourapp.com/cloud-storage",
          date: "2025-03-20",
        },
      ],
      healthSectorNews: [
        {
          title: "AI Revolutionizing Disease Diagnosis",
          description: "AI models are now detecting diseases like cancer with higher accuracy than ever before.",
          link: "https://www.healthnews.com/ai-diagnosis",
          date: "2025-04-01",
        },
        {
          title: "Wearable Tech: The Future of Health Monitoring",
          description: "Wearable devices are tracking vitals and detecting anomalies to prevent health risks.",
          link: "https://www.healthnews.com/wearable-tech",
          date: "2025-03-29",
        },
        {
          title: "WHO Releases New Guidelines for Heart Health",
          description: "The World Health Organization has introduced new measures to prevent cardiovascular diseases.",
          link: "https://www.who.int/news-heart-health",
          date: "2025-03-25",
        },
      ],
    };

    setNewState(data);
  }, []);

  useEffect(() => {
    const scrollContainer = document.getElementById("scrollable-container");
    if (!scrollContainer) return;

    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
          scrollContainer.scrollTop = 0; // Reset to top when reaching the bottom
        } else {
          scrollContainer.scrollTop += 1; // Scroll down slowly
        }
      }, 50); // Adjust speed by changing this value
    };

    if (!isPaused) {
      startScrolling();
    }

    return () => clearInterval(scrollInterval);
  }, [isPaused]); // Re-run effect when `isPaused` changes


  return (
    <div
      id="scrollable-container"
      style={{
        flexGrow: 1, // Takes the remaining space inside .dashboard-card
    overflowY: "auto", // Enables scrolling
    padding: "10px",
    scrollbarWidth: "none", // Hide scrollbar in Firefox
    msOverflowStyle: "none" // Hide scrollbar in IE/Edge
      }}
      onMouseEnter={() => setIsPaused(true)} // Pause when hovering
      onMouseLeave={() => setIsPaused(false)} // Resume when leaving
    >

<ul className="updates-list">
  {newState.appUpdates.map((val, idx) => (
    <li key={idx} className="update-item">
      <a href={val.link} target="_blank" rel="noopener noreferrer" className="update-title">
        {val.title}
      </a>
      <p className="update-description">{val.description}</p>
      <small className="update-date">{val.date}</small>
    </li>
  ))}
</ul>

<ul className="updates-list">
  {newState.healthSectorNews.map((val, idx) => (
    <li key={idx} className="update-item">
      <a href={val.link} target="_blank" rel="noopener noreferrer" className="update-title">
        {val.title}
      </a>
      <p className="update-description">{val.description}</p>
      <small className="update-date">{val.date}</small>
    </li>
  ))}
</ul>

    </div>
  );
}

export default NewComponents;
