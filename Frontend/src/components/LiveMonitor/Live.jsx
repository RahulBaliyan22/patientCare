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
          <strong>{value !== null ? `${value}` : "--"}</strong>
        </Typography>
      </Box>
    </Box>
  );
}

const MessageBox = React.memo(({ messageIndex,value1,value2,value3 }) => {
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
        return (<div className="gridPapa">
          <div className="grid1"><strong>Heart Rate(in BPM)</strong><br/>{value1 && <CircularProgressWithLabel value={value1}/>}</div>
          <div className="grid2"><strong>Spo2(in %)</strong><br/>{value2 && <CircularProgressWithLabel value={value2}/>}</div>
          <div className="grid3">YOUR RESULTS</div>
          <div className="grid4"><strong>Body Temperature(in °C)</strong><br/>{value3 && <CircularProgressWithLabel value={value3}/>}</div>
        </div>)
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
          setMessageIndex(6,data,spo2.value,temperature.value);
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
          setMessageIndex(6 , heartRate.value,data,temperature.value);
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
          setMessageIndex(6,heartRate.value,spo2.value,data);
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
      <MessageBox messageIndex={messageIndex} />
      <div className="box2">
        <h2 style={{ textAlign: "center" }}>Vitals Monitoring</h2>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            justifyContent: "space-around",
            marginTop: "50px",
          }}
        >
          {/* Heart Rate */}
          <li style={{ display: "flex", flexDirection: "column" }}>
            <h3 title="A normal resting heart rate for adults ranges from 60 to 100 beats per minute.">
              Heart Rate
            </h3>
            {heartRate.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : heartRate.value !== null ? (
              <CircularProgressWithLabel value={heartRate.value} />
            ) : null}
            <p>{heartRate.value !== null ? `${heartRate.value} BPM` : "-- BPM"}</p>
            <div className="buttons">
              <button className="start-btn" onClick={() => handleVitalCheck("heartRate", 2)} style={{width:"150px",cursor:"pointer"}}>
                {!heartRate.active ? "Start" : "Stop"}
              </button>
            </div>
          </li>

          {/* SpO2 */}
          <li style={{ display: "flex", flexDirection: "column" }}>
            <h3 title="Normal SpO2 should be between 96% to 99%.">
              SpO2
            </h3>
            {spo2.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : spo2.value !== null ? (
              <CircularProgressWithLabel value={spo2.value} />
            ) : null}
            <p>{spo2.value !== null ? `${spo2.value}%` : "--%"}</p>
            <div className="buttons">
              <button className="start-btn" onClick={() => handleVitalCheck("spo2", 4)} style={{width:"150px",cursor:"pointer"}}>
                {!spo2.active ? "Start" : "Stop"}
              </button>
            </div>
          </li>

          {/* Temperature */}
          <li style={{ display: "flex", flexDirection: "column" }}>
            <h3 title="Typical adult body temperature ranges from 36.1°C to 37.2°C.">
              Body Temperature
            </h3>
            {temperature.loading ? (
              <CircularProgress disableShrink size={100} thickness={5} />
            ) : temperature.value !== null ? (
              <CircularProgressWithLabel value={temperature.value} />
            ) : null}
            <p>{temperature.value !== null ? `${temperature.value}°C` : "--°C"}</p>
            <div className="buttons">
              <button className="start-btn" onClick={() => handleVitalCheck("temperature", 3)} style={{width:"150px",cursor:"pointer"}}>
                {!temperature.active ? "Start" : "Stop"}
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div className="box3">
        <CurrentData    heartData={heartRate.value}
          tempData={temperature.value}
          spo2Data={spo2.value}/>
      </div>

      <div className="box4">
        <Data/>
      </div>
    </div>
  );
}

export default Live;
