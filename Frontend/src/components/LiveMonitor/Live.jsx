import React, { useState, useEffect, useMemo } from "react";
import "./LiveCss.css";
import Data from "../HealthRecord/Data";
import CurrentData from "../CurrentData/CurrentData";
import { CircularProgress, Typography, Box } from "@mui/material";
import { bodyTemp, heartSocket, spo2Socket } from "../../util/vitalScoket";
import axios from "axios";

function CircularProgressWithLabel({ value }) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={value || 0}
        size={100}
        thickness={5}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          fontWeight="bold"
          sx={{ fontSize: "1.2rem" }}
        >
          {value !== null ? `${value}` : "--"}
        </Typography>
      </Box>
    </Box>
  );
}


const MessageBox = React.memo(({ messageIndex, resultValues }) => {
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
        return (
          <div className="gridPapa">
            <div className="grid1">
              <strong>Heart Rate (in BPM)</strong>
              <br />
              {resultValues.heart !== null && <CircularProgressWithLabel value={resultValues.heart} />}
            </div>
            <div className="grid2">
              <strong>SpO2 (in %)</strong>
              <br />
              {resultValues.spo2 !== null && <CircularProgressWithLabel value={resultValues.spo2} />}
            </div>
            <div className="grid3">YOUR RESULTS</div>
            <div className="grid4">
              <strong>Body Temperature (in °C)</strong>
              <br />
              {resultValues.temp !== null && <CircularProgressWithLabel value={resultValues.temp} />}
            </div>
          </div>
        );
      default:
        return "Unknown Message";
    }
  }, [messageIndex, resultValues]);

  return (
    <div className="box1">
      <h3>Messages</h3>
      <p>{message}</p>
    </div>
  );
});

function Live() {
  const [messageIndex, setMessageIndex] = useState(1);
  const [resultValues, setResultValues] = useState({ heart: null, spo2: null, temp: null });

  const [heartRate, setHeartRate] = useState({ value: null, loading: false, active: false });
  const [spo2, setSpo2] = useState({ value: null, loading: false, active: false });
  const [temperature, setTemperature] = useState({ value: null, loading: false, active: false });

  useEffect(() => {
    return () => {
      heartSocket.disconnect();
      spo2Socket.disconnect();
      bodyTemp.disconnect();
    };
  }, []);

  const handleSubmitData = async (name, value) => {
    try {
      await axios.post("https://patientcare-2.onrender.com/vitals/add", { [name]: value }, {
        withCredentials: true,
      });
      console.log("Data submitted");
    } catch (e) {
      console.error("Submit error:", e);
    }
  };

  function handleVitalCheck(type, msgIndex) {
    setMessageIndex(msgIndex);

    try {
      if (type === "heartRate" && !heartRate.active) {
        setHeartRate({ value: null, loading: true, active: true });
        heartSocket.connect();
        heartSocket.emit("start", "start process");

        const handleHeartData = async (data) => {
          setHeartRate({ value: data, loading: false, active: false });
          await handleSubmitData("heartData", data);
          setResultValues((prev) => ({ ...prev, heart: data }));
          setMessageIndex(6);
          heartSocket.off("heartData", handleHeartData);
        };

        heartSocket.on("heartData", handleHeartData);
      } else if (type === "heartRate") {
        heartSocket.disconnect();
        setHeartRate((prev) => ({ ...prev, loading: false, active: false }));
      }

      if (type === "spo2" && !spo2.active) {
        setSpo2({ value: null, loading: true, active: true });
        spo2Socket.connect();
        spo2Socket.emit("start", "start process");

        const handleSpo2Data = async (data) => {
          setSpo2({ value: data, loading: false, active: false });
          await handleSubmitData("spo2data", data);
          setResultValues((prev) => ({ ...prev, spo2: data }));
          setMessageIndex(6);
          spo2Socket.off("spo2Data", handleSpo2Data);
        };

        spo2Socket.on("spo2Data", handleSpo2Data);
      } else if (type === "spo2") {
        spo2Socket.disconnect();
        setSpo2((prev) => ({ ...prev, loading: false, active: false }));
      }

      if (type === "temperature" && !temperature.active) {
        setTemperature({ value: null, loading: true, active: true });
        bodyTemp.connect();
        bodyTemp.emit("start", "start process");

        const handleTempData = async (data) => {
          setTemperature({ value: data, loading: false, active: false });
          await handleSubmitData("tempdata", data);
          setResultValues((prev) => ({ ...prev, temp: data }));
          setMessageIndex(6);
          bodyTemp.off("tempData", handleTempData);
        };

        bodyTemp.on("tempData", handleTempData);
      } else if (type === "temperature") {
        bodyTemp.disconnect();
        setTemperature((prev) => ({ ...prev, loading: false, active: false }));
      }
    } catch (e) {
      console.error("Error:", e);
      setMessageIndex(5);
    }
  }

  return (
    <div className="ContainerGrid">
      <MessageBox messageIndex={messageIndex} resultValues={resultValues} />
      <div className="box2">
        <h2 style={{ textAlign: "center" }}>Vitals Monitoring</h2>
        <ul style={{
          listStyle: "none",
          display: "flex",
          justifyContent: "space-around",
          marginTop: "50px",
        }}>
          {/* Heart Rate */}
          <li style={{ display: "flex", flexDirection: "column" }}>
            <h3 title="A normal resting heart rate for adults ranges from 60 to 100 beats per minute.">Heart Rate</h3>
            {heartRate.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : heartRate.value !== null ? (
              <CircularProgressWithLabel value={heartRate.value} />
            ) : null}
            <p>{heartRate.value !== null ? `${heartRate.value} BPM` : "-- BPM"}</p>
            <button className="start-btn" onClick={() => handleVitalCheck("heartRate", 2)} style={{ width: "150px", cursor: "pointer" }}>
              {!heartRate.active ? "Start" : "Stop"}
            </button>
          </li>

          {/* SpO2 */}
          <li style={{ display: "flex", flexDirection: "column" }}>
            <h3 title="Normal SpO2 should be between 96% to 99%.">SpO2</h3>
            {spo2.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : spo2.value !== null ? (
              <CircularProgressWithLabel value={spo2.value} />
            ) : null}
            <p>{spo2.value !== null ? `${spo2.value}%` : "--%"}</p>
            <button className="start-btn" onClick={() => handleVitalCheck("spo2", 4)} style={{ width: "150px", cursor: "pointer" }}>
              {!spo2.active ? "Start" : "Stop"}
            </button>
          </li>

          {/* Temperature */}
          <li style={{ display: "flex", flexDirection: "column" }}>
            <h3 title="Typical adult body temperature ranges from 36.1°C to 37.2°C.">Body Temperature</h3>
            {temperature.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : temperature.value !== null ? (
              <CircularProgressWithLabel value={temperature.value} />
            ) : null}
            <p>{temperature.value !== null ? `${temperature.value}°C` : "--°C"}</p>
            <button className="start-btn" onClick={() => handleVitalCheck("temperature", 3)} style={{ width: "150px", cursor: "pointer" }}>
              {!temperature.active ? "Start" : "Stop"}
            </button>
          </li>
        </ul>
      </div>

      <div className="box3">
        <CurrentData
          heartData={heartRate.value}
          tempData={temperature.value}
          spo2Data={spo2.value}
        />
      </div>

      <div className="box4">
        <Data />
      </div>
    </div>
  );
}

export default Live;
