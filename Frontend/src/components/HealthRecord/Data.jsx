import * as React from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Data() {
  const [heartRateData, setHeartRateData] = React.useState([]);
  const [spo2Data, setSpo2Data] = React.useState([]);
  const [bodyTempData, setBodyTempData] = React.useState([]);
  const [timeLabels, setTimeLabels] = React.useState([]);
  const fetchVitals = async () => {
    try {
      const response = await axios.get("https://patientcare-2.onrender.com/vitals/data", {
        withCredentials: true,
      });
  
      const { heartRate, SpO2, temperature } = response.data;
  
      // Helper to convert date + time into a unified timestamp
      const toTimestamp = (item) => `${item.date}T${item.time}`;
  
      const timeSet = new Set([
        ...heartRate.map(toTimestamp),
        ...SpO2.map(toTimestamp),
        ...temperature.map(toTimestamp),
      ]);
  
      const rawLabels = Array.from(timeSet).sort(); // keep raw ISO strings
  
      const heartMap = new Map(heartRate.map((item) => [toTimestamp(item), item.data]));
      const spo2Map = new Map(SpO2.map((item) => [toTimestamp(item), item.data]));
      const tempMap = new Map(temperature.map((item) => [toTimestamp(item), item.data]));
  
      const alignedHeart = rawLabels.map((time) => heartMap.get(time) ?? null);
      const alignedSpo2 = rawLabels.map((time) => spo2Map.get(time) ?? null);
      const alignedTemp = rawLabels.map((time) => tempMap.get(time) ?? null);
  
      // Format the label for x-axis: 'YYYY-MM-DD HH:mm:ss'
      const formattedLabels = rawLabels.map((ts) => {
        const dateObj = new Date(ts);
        return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
      });
  
      setTimeLabels(formattedLabels);
      setHeartRateData(alignedHeart);
      setSpo2Data(alignedSpo2);
      setBodyTempData(alignedTemp);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };
  
  React.useEffect(() => {
    fetchVitals();
  }, []);

  return (
    <div>
      <button onClick={fetchVitals}>🔁 Refresh</button>
      <LineChart
        width={500}
        height={300}
        series={[
          { data: heartRateData, label: "Heart Rate (BPM)" },
          { data: spo2Data, label: "SpO2 (%)" },
          { data: bodyTempData, label: "Body Temp (°C)" },
        ]}
        xAxis={[{ scaleType: "point", data: timeLabels }]}
      />
    </div>
  );
}
