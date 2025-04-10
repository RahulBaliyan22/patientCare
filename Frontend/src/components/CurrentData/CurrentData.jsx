import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function CurrentData({heartData,spo2Data, tempData}) {
  const [selectedMetric, setSelectedMetric] = React.useState("heartRate");

  const metricsData = {
    heartRate: { data: [heartData]||[0], label: "Heart Rate (BPM)" },
    spo2: { data: [spo2Data]||[0], label: "SpO2 (%)" },
    temperature: { data: [tempData]||[0], label: "Body Temp (°C)" },
  };

  // Get current data based on selection
  const { data, label } = metricsData[selectedMetric];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
        <button  style={{width:"300px",cursor:"pointer"}} onClick={() => setSelectedMetric("heartRate")}>Heart Rate</button>
        <button style={{width:"300px",cursor:"pointer"}} onClick={() => setSelectedMetric("spo2")}>SpO2</button>
        <button style={{width:"300px",cursor:"pointer"}} onClick={() => setSelectedMetric("temperature")}>Body Temp</button>
      </div>

      <BarChart
        width={500}
        height={300}
        series={[{ data, label, type: "bar" }]}
        xAxis={[{ scaleType: "band", data: [label] }]} // Show only the selected metric
      />
    </div>
  );
}
