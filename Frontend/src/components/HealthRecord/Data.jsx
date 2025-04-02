import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const heartRateData = [72, 75, 78, 80, 77, 74, 73];
const spo2Data = [98, 97, 96, 95, 96, 97, 98];
const bodyTempData = [36.5, 36.7, 37.0, 37.2, 37.1, 36.9, 36.8];
const timeLabels = [
  '10:00 AM',
  '10:10 AM',
  '10:20 AM',
  '10:30 AM',
  '10:40 AM',
  '10:50 AM',
  '11:00 AM',
];

export default function Data() {
  return (
    <LineChart
      width={500}
      height={300}
      series={[
        { data: heartRateData, label: 'Heart Rate (BPM)' },
        { data: spo2Data, label: 'SpO2 (%)' },
        { data: bodyTempData, label: 'Body Temp (°C)' }
      ]}
      xAxis={[{ scaleType: 'point', data: timeLabels }]}
    />
  );
}
