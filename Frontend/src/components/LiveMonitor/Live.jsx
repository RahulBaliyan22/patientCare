import React, { useState, useMemo } from "react";
import "./LiveCss.css";
import Data from "../HealthRecord/Data";
import CurrentData from "../CurrentData/CurrentData";
import { CircularProgress, Typography, Box } from "@mui/material";

function CircularProgressWithLabel({ value }) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value || 0} size={100} thickness={5} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {value !== null ? `${value}` : "--"}
        </Typography>
      </Box>
    </Box>
  );
}

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
  const [heartRate, setHeartRate] = useState({ value: null, loading: false });
  const [spo2, setSpo2] = useState({ value: null, loading: false });
  const [temperature, setTemperature] = useState({ value: null, loading: false });

  function handleVitalCheck(type, msgIndex) {
    setMessageIndex(msgIndex);

    if (type === "heartRate") {
      setHeartRate({ value: null, loading: true });
      setTimeout(() => setHeartRate({ value: 80, loading: false }), 5000);
    } else if (type === "spo2") {
      setSpo2({ value: null, loading: true });
      setTimeout(() => setSpo2({ value: 98, loading: false }), 5000);
    } else if (type === "temperature") {
      setTemperature({ value: null, loading: true });
      setTimeout(() => setTemperature({ value: 36.5, loading: false }), 5000);
    }
  }

  return (
    <div className="ContainerGrid">
      <MessageBox messageIndex={messageIndex} />
      <div className="box2">
        <h2>Vitals Monitoring</h2>
        <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-around" }}>
          <li style={{display:"flex",flexDirection:"column"}}>
            <a href="#">Heart Rate</a>
            {heartRate.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : (
              heartRate.value!==null &&<CircularProgressWithLabel value={heartRate.value} />
            )}
            <p>{heartRate.value !== null ? `${heartRate.value} BPM` : "-- BPM"}</p>
            <div className="buttons">
              <button className="start-btn" onClick={() => handleVitalCheck("heartRate", 2)}>
                {!heartRate.loading && "Start"}
              </button>
            </div>
          </li>
          <li>
            <a href="#">SpO2</a>
            {spo2.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : (
              spo2.value!==null &&<CircularProgressWithLabel value={spo2.value} />
            )}
            <p>{spo2.value !== null ? `${spo2.value}%` : "--%"}</p>
            <div className="buttons">
              <button className="start-btn" onClick={() => handleVitalCheck("spo2", 4)}>
                {!spo2.loading && "Start"}
              </button>
            </div>
          </li>
          <li>
            <a href="#">Body Temperature</a>
            {temperature.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : (
              temperature.value!==null&&<CircularProgressWithLabel value={temperature.value} />
            )}
            <p>{temperature.value !== null ? `${temperature.value}°C` : "--°C"}</p>
            <div className="buttons">
              <button className="start-btn" onClick={() => handleVitalCheck("temperature", 3)}>
                {!temperature.loading && "Start"}
              </button>
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
