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
      <button style={{border:"none",background:"none",cursor:"pointer",width:"150px"}} onClick={fetchVitals}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#004d4d"><path d="M164.67-160v-66.67H288l-15.33-12.66q-60-49.34-86.34-109Q160-408 160-477.33q0-107.67 63.83-192.84 63.84-85.16 167.5-115.83v69.33q-74 28-119.33 93.84-45.33 65.83-45.33 145.5 0 57 21.33 102.16 21.33 45.17 60 79.84L331.33-278v-115.33H398V-160H164.67Zm404.66-13.33v-70q74.67-28 119.34-93.84 44.66-65.83 44.66-145.5 0-47-21.33-94.16-21.33-47.17-58.67-84.5L630.67-682v115.33H564V-800h233.33v66.67h-124l15.34 14q56.33 53.66 83.83 115.5Q800-542 800-482.67 800-375 736.5-289.5 673-204 569.33-173.33Z"/></svg> Refresh</button>
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
