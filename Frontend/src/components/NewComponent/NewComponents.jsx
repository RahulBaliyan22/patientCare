import React, { useEffect, useState } from "react";

function NewComponents() {
  const [newState, setNewState] = useState({
    appUpdates: [],
    healthSectorNews: [],
  });

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

    let scrollInterval = setInterval(() => {
      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        scrollContainer.scrollTop = 0; // Reset to top when reaching the bottom
      } else {
        scrollContainer.scrollTop += 1; // Scroll down slowly
      }
    }, 50); // Adjust speed by changing this value

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, []);

  return (
    <div
      id="scrollable-container"
      style={{
        maxWidth: "400px",
        height: "300px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        scrollbarWidth: "thin", // For Firefox
        scrollbarColor: "#888 #f1f1f1",
      }}
    >
      <h2>What's New</h2>

      <h3>App Updates</h3>
      <ul>
        {newState.appUpdates.map((val, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            <a href={val.link} target="_blank" rel="noopener noreferrer">
              <strong>{val.title}</strong>
            </a>
            <p>{val.description}</p>
            <small>{val.date}</small>
          </li>
        ))}
      </ul>

      <h3>Health Sector News</h3>
      <ul>
        {newState.healthSectorNews.map((val, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            <a href={val.link} target="_blank" rel="noopener noreferrer">
              <strong>{val.title}</strong>
            </a>
            <p>{val.description}</p>
            <small>{val.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewComponents;
