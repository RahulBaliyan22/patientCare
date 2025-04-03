import * as React from "react";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";

const metricsData = {
  heartRate: [72, 75, 78, 80, 76, 74, 79], // Example BPM values
  spo2: [98, 97, 96, 95, 94, 93, 92], // Example SpO2 %
  temperature: [36.5, 36.8, 37.0, 37.2, 37.1, 36.9, 36.6], // Example Celsius values
};

const xLabels = ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"];

export default function CurrentData() {
  const [selectedMetric, setSelectedMetric] = React.useState("heartRate");

  // Get the current data based on selected metric
  const currentData = metricsData[selectedMetric];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setSelectedMetric("heartRate")}>Heart Rate</button>
        <button onClick={() => setSelectedMetric("spo2")}>SpO2</button>
        <button onClick={() => setSelectedMetric("temperature")}>Body Temp</button>
      </div>

      <ChartContainer
        width={500}
        height={300}
        series={[{ data: currentData, label: selectedMetric, type: "bar" }]}
        xAxis={[{ scaleType: "band", data: xLabels }]}
      >
        <BarPlot />
      </ChartContainer>
    </div>
  );
}
