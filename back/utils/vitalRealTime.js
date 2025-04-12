
const { authorizeRole } = require("../middleware");
let esp32Socket = null;
const heartInfo = (io,wss) => {
  wss.on("connection", (ws) => {
    console.log("✅ ESP32 WebSocket connected");
    esp32Socket = ws;
  
    ws.on("message", (message) => {
      console.log("📦 Message from ESP32:", message.toString());
  
      // Forward message to frontend via Socket.IO
      io.of("/vital-heart-rate").emit("heartDataFromSensor", message.toString());
    });
  
    ws.on("close", () => {
      console.log("❌ ESP32 WebSocket disconnected");
      esp32Socket = null;
    });
  });

  
  const vitalsNamespace = io.of("/vital-heart-rate");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("heart connected");
    socket.on("start", () => {
      console.log("📥 connectToESP32 event from frontend");

    if (esp32Socket && esp32Socket.readyState === WebSocket.OPEN) {
      esp32Socket.send("start"); // Tell ESP32 to send heart data
      console.log("📤 Sent 'start' command to ESP32");
    } else {
      console.log("⚠️ ESP32 not connected");
      socket.emit("esp32-not-connected");
    }
    });
    socket.on("heartDataFromSensor", (data) => {
      socket.emit("heartData", data);
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
