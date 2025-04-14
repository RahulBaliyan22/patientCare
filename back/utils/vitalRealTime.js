const { authorizeRole } = require("../middleware");
const { value } = require('./sharedVitals');
const { device } = require('./iotClient');

const heartInfo = (io) => {
  const vitalsNamespace = io.of("/vital-heart-rate");
  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("🫀 Patient connected for heart data");

    socket.on("start", () => {
      device.publish("patientcare/control", JSON.stringify("get_hr"));

      // Wait a moment and send once
      setTimeout(() => {
        if (value.heart) {
          socket.emit("heartData", value.heart);
          value.heart = null;
        } else {
          socket.emit("heartData", { error: "No heart data received." });
        }
      }, 1000); // Wait 1 sec to allow sensor to respond
    });

    socket.on("stop", () => {
      device.publish("patientcare/control", JSON.stringify("stop"));
    });

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

    socket.on("start", () => {
      device.publish("patientcare/control", JSON.stringify("get_spo2"));

      setTimeout(() => {
        if (value.spo2) {
          socket.emit("spo2Data", value.spo2);
          value.spo2 = null;
        } else {
          socket.emit("spo2Data", { error: "No SpO2 data received." });
        }
      }, 1000);
    });

    socket.on("stop", () => {
      device.publish("patientcare/control", JSON.stringify("stop"));
    });

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

    socket.on("start", () => {
      device.publish("patientcare/control", JSON.stringify("get_temp"));

      setTimeout(() => {
        if (value.temp) {
          socket.emit("tempData", value.temp);
          value.temp = null;
        } else {
          socket.emit("tempData", { error: "No temperature data received." });
        }
      }, 1000);
    });

    socket.on("stop", () => {
      device.publish("patientcare/control", JSON.stringify("stop"));
    });

    socket.on("disconnect", () => {
      console.log("🔴 Temp namespace disconnected");
    });
  });
};

module.exports = { heartInfo, spoInfo, tempInfo, value };
