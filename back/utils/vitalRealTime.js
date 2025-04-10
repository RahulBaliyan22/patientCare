const { authorizeRole } = require("../middleware");

const heartInfo = (io) => {
  const vitalsNamespace = io.of("/vital-heart-rate");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("heart connected");
    socket.on("start", () => {
      try {
        //make hardware start call
        socket.emit("heartData", 80);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴heart disconnected");
    });
  });
};

const spoInfo = (io) => {
  const vitalsNamespace = io.of("/vital-spo2");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("spo2 connected");
    socket.on("start", () => {
      try {
        //make hardware start call
        socket.emit("spo2Data", 90);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴spo2 disconnected");
    });
  });
};

const tempInfo = (io) => {
  const vitalsNamespace = io.of("/vital-body-temp");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("body temp connected");
    socket.on("start", () => {
      try {
        //make hardware start call
        socket.emit("tempData", 36);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("disconnect", () => {
      console.log("🔴temp disconnected");
    });
  });
};

module.exports = { heartInfo, tempInfo, spoInfo };
