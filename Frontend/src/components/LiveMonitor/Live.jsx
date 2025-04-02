import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CircularProgress } from "@mui/material";

const Live = () => {
  const [heartRate, setHeartRate] = useState(80);
  const [spo2, setSpo2] = useState(98);
  const [temperature, setTemperature] = useState(36.5);
  const [vitalData, setVitalData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => Math.max(60, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpo2((prev) => Math.max(92, Math.min(100, prev + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => Math.max(35.5, Math.min(38, prev + (Math.random() * 0.5 - 0.25))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitalData((prev) => [...prev.slice(-20), { time: new Date().toLocaleTimeString(), heartRate, spo2, temperature }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [heartRate, spo2, temperature]);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="flex flex-col items-center">
          <h2 className="text-xl font-bold">Heart Rate</h2>
          <CircularProgress variant="determinate" value={(heartRate - 60) * 2} size={100} thickness={5} />
          <p className="text-2xl font-semibold mt-2">{Math.round(heartRate)} BPM</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center">
          <h2 className="text-xl font-bold">SpO2</h2>
          <CircularProgress variant="determinate" value={(spo2 - 92) * 12.5} size={100} thickness={5} />
          <p className="text-2xl font-semibold mt-2">{Math.round(spo2)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center">
          <h2 className="text-xl font-bold">Temperature</h2>
          <CircularProgress variant="determinate" value={(temperature - 35.5) * 40} size={100} thickness={5} />
          <p className="text-2xl font-semibold mt-2">{temperature.toFixed(1)}°C</p>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardContent>
          <h2 className="text-xl font-bold">Vital Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vitalData}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="heartRate" stroke="#ff7300" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spo2" stroke="#0088FE" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="temperature" stroke="#00C49F" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Live;
