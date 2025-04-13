const { authorizeRole } = require("../middleware");
const { isESPConnected, sendToESP } = require("./espConfig");

const { value } = require('./sharedVitals');

const heartInfo = (io) => {
  const vitalsNamespace = io.of("/vital-heart-rate");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("🫀 Patient connected for heart data");

    socket.on("start", () => sendToESP("start_measurement"));
    socket.on("stop", () => sendToESP("stop_measurement"));
    socket.on("activate_sensor", () => sendToESP("activate_sensor", { sensor: "heart" }));

    if (value.heart) {
      socket.emit("heartData", value.heart);
      value.heart = null; // Reset after sending the data
    }

    // Optionally, send back ESP connection status
    socket.emit("esp_status", { connected: isESPConnected() });
    socket.on("disconnect", () => {
      console.log("🔴 Heart namespace disconnected");
    });
  });
};

const spoInfo = (io) => {
  const vitalsNamespace = io.of("/vital-spo2");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("🩸 Patient connected for SpO2 data");

    socket.on("start", () => sendToESP("start_measurement"));
    socket.on("stop", () => sendToESP("stop_measurement"));
    socket.on("activate_sensor", () => sendToESP("activate_sensor", { sensor: "spo2" }));

    if (value.spo2) {
      socket.emit("spo2Data", value.spo2);
      value.spo2 = null; // Reset after sending the data
    }

    socket.on("disconnect", () => {
      console.log("🔴 SpO2 namespace disconnected");
    });
  });
};

const tempInfo = (io) => {
  const vitalsNamespace = io.of("/vital-body-temp");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("🌡️ Patient connected for temperature data");

    socket.on("start", () => sendToESP("start_measurement"));
    socket.on("stop", () => sendToESP("stop_measurement"));
    socket.on("activate_sensor", () => sendToESP("activate_sensor", { sensor: "temp" }));

    if (value.temp) {
      socket.emit("tempData", value.temp);
      value.temp = null; // Reset after sending the data
    }

    socket.on("disconnect", () => {
      console.log("🔴 Temp namespace disconnected");
    });
  });
};

module.exports = { heartInfo, spoInfo, tempInfo, value };
