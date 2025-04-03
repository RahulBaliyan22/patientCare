import React, { useState, useMemo } from "react";
import "./LiveCss.css";
import Data from "../HealthRecord/Data";
import CurrentData from "../CurrentData/CurrentData";

// ✅ Memoized MessageBox Component
const MessageBox = React.memo(({ messageIndex }) => {
  const message = useMemo(() => {
    switch (messageIndex) {
      case 1:
        return "Check Vitals";
      case 2:
        return "Checking Heart Rate...";
      case 3:
        return "Checking Temperature...";
      case 4:
        return "Checking SpO2...";
      case 5:
        return "Please put your finger on the sensor";
      case 6:
        return <strong>Your Results</strong>;
      default:
        return "Unknown Message";
    }
  }, [messageIndex]);

  return (
    <div className="box1">
      <h3>Messages</h3>
      <p>{message}</p>
    </div>
  );
});

function Live() {
  const [messageIndex, setMessageIndex] = useState(1);

  // Function to change the message dynamically
  const nextMessage = () => {
    setMessageIndex((prev) => (prev < 6 ? prev + 1 : 1));
  };

  return (
    <div className="ContainerGrid">
      {/* ✅ Only this component updates efficiently */}
      <MessageBox messageIndex={messageIndex} />

      <div className="box2">
        <h2>Vitals Monitoring</h2>
        <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-around" }}>
          <li>
            <a href="#">Heart Rate</a>
            <div className="buttons">
              <button className="start-btn" onClick={()=>{setMessageIndex(2)}}>Start</button>
              <button className="stop-btn">Stop</button>
            </div>
          </li>
          <li>
            <a href="#">SpO2</a>
            <div className="buttons">
              <button className="start-btn" onClick={()=>{setMessageIndex(4)}}>Start</button>
              <button className="stop-btn">Stop</button>
            </div>
          </li>
          <li>
            <a href="#">Body Temperature</a>
            <div className="buttons">
              <button className="start-btn" onClick={()=>{setMessageIndex(3)}}>Start</button>
              <button className="stop-btn">Stop</button>
            </div>
          </li>
        </ul>
      </div>

      <div className="box3">
        <CurrentData />
      </div>
      <div className="box4">
        <Data />
      </div>
    </div>
  );
}

export default Live;
