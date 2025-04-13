let espSocket = null; // will store ESP32 socket connection
let { value } = require("./sharedVitals");

const handleSensorData = (sensorType) => (data) => {
  console.log(`Received ${sensorType} data: `, data);
  value[sensorType] = data; // Dynamically update the correct value based on sensor type
};

module.exports = {
  registerESP: (socket) => {
    console.log(`✅ ESP32 connected [id: ${socket.id}]`);
    espSocket = socket;

    socket.on("disconnect", () => {
      console.log("❌ ESP32 disconnected");
      espSocket = null;
    });

    // Listen for events from ESP32 (sensor data)
    socket.on("sensor_data_heart", handleSensorData("heart"));
    socket.on("sensor_data_spo2", handleSensorData("spo2"));
    socket.on("sensor_data_temp", handleSensorData("temp"));
  },

  sendToESP: (event, data = {}) => {
    if (espSocket) {
      console.log(`➡️ Sending event '${event}' to ESP32`, data);
      espSocket.emit(event, data);
    } else {
      console.log("⚠️ ESP32 not connected, unable to send event.");
    }
  },

  isESPConnected: () => !!espSocket,
};
