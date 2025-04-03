import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";



export default function CurrentData() {
  const [selectedMetric, setSelectedMetric] = React.useState("heartRate");
  const metricsData = {
    heartRate: [72], // Example BPM values
    spo2: [98], // Example SpO2 %
    temperature: [36.5], // Example Celsius values
  };
  
  const xLabels = ["heartRate", "spo2", "temperature"];
  // Get the current data based on selected metric
  const currentData = metricsData[selectedMetric];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setSelectedMetric("heartRate")}>Heart Rate</button>
        <button onClick={() => setSelectedMetric("spo2")}>SpO2</button>
        <button onClick={() => setSelectedMetric("temperature")}>Body Temp</button>
      </div>

      
        <BarChart width={500}
        height={300}
        series={[{ data: currentData, label: selectedMetric, type: "bar" }]}
        xAxis={[{ scaleType: "band", data: xLabels }]} 
        />
    </div>
  );
}
