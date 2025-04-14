const { authorizeRole } = require("../middleware");
const { value } = require('./sharedVitals');
const { device } = require('./iotClient');
const { waitingSockets } = require("./waitingSockets");

const heartInfo = (io) => {
  const vitalsNamespace = io.of("/vital-heart-rate");
  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("🫀 Patient connected for heart data");

    socket.on("start", () => {
      device.publish("patientcare/control", "start");
      waitingSockets[socket.id+"_get_hr"] = {  type:"get_hr", socket };
      const requestData = {
        type: "get_hr&",
        socketId: socket.id // Pass socket.id to ESP32
      };
      device.publish("patientcare/control", JSON.stringify(requestData));
    });

    socket.on("stop", () => {
      device.publish("patientcare/control", "stop");
      delete waitingSockets[socket.id+"_get_hr"];
    });

    socket.on("disconnect", () => {
      console.log("🔴 Heart namespace disconnected");
      delete waitingSockets[socket.id+"_get_hr"];
    });
  });
};

const spoInfo = (io) => {
  const vitalsNamespace = io.of("/vital-spo2");
  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    device.publish("patientcare/control", "start");
    console.log("🩸 Patient connected for SpO2 data");

    socket.on("start", () => {
      waitingSockets[socket.id+"_get_spo2"] = {  type:"get_spo2", socket };
      const requestData = {
        type: "get_spo2&",
        socketId: socket.id // Pass socket.id to ESP32
      };
      device.publish("patientcare/control", JSON.stringify(requestData));
    });

    socket.on("stop", () => {
      device.publish("patientcare/control", "stop");
      delete waitingSockets[socket.id+"_get_spo2"];
    });

    socket.on("disconnect", () => {
      console.log("🔴 Heart namespace disconnected");
      delete waitingSockets[socket.id+"_get_spo2"];
    });
  });
};

const tempInfo = (io) => {
  const vitalsNamespace = io.of("/vital-body-temp");
  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    device.publish("patientcare/control", "start");
    console.log("🌡️ Patient connected for temperature data");

    socket.on("start", () => {
      waitingSockets[socket.id+"_get_temp"] = {  type:"get_temp", socket };
      const requestData = {
        type: "get_temp&",
        socketId: socket.id // Pass socket.id to ESP32
      };
      device.publish("patientcare/control", JSON.stringify(requestData));
    });

    socket.on("stop", () => {
      device.publish("patientcare/control", "stop");
      delete waitingSockets[socket.id+"_get_temp"];
    });

    socket.on("disconnect", () => {
      console.log("🔴 Heart namespace disconnected");
      delete waitingSockets[socket.id+"_get_temp"];
    });
  });
};

module.exports = { heartInfo, spoInfo, tempInfo, value };
