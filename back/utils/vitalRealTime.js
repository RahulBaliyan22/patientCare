const { authorizeRole } = require("../middleware");
const WebSocket = require("ws");

let value = {heart:null,spo2:null,temp:null}



const connectToESP = (type) => {
  const esp32HeartScoket = new WebSocket("ws://192.168.1.9:80/ws");

  esp32HeartScoket.on("open", () => {
    console.log("✅ Connected to ESP32 WebSocket server");
  });

  esp32HeartScoket.on("message", (data) => {
    try {
      const { type, value: v } = JSON.parse(data);
      if (type === "heart") value.heart = v;
      else if (type === "spo2") value.spo2 = v;
      else if (type === "temp") value.temp = v;
    } catch (e) {
      console.error("Invalid JSON from ESP:", data.toString());
    }
  });
  

  esp32HeartScoket.on("error", (err) => {
    console.error("❌ WebSocket error:", err.message);
  });

  esp32HeartScoket.on("close", () => {
    console.log("🔌 ESP32 WebSocket disconnected");
  });
};

const heartInfo = (io) => {
  const vitalsNamespace = io.of("/vital-heart-rate");

  vitalsNamespace.use(authorizeRole("patient"));

  vitalsNamespace.on("connection", (socket) => {
    console.log("heart connected");
    socket.on("start", () => {
      try {
        //make hardware start call
        connectToESP("heart");
        socket.emit("heartData", value.heart);
        value.heart=null
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
        connectToESP("spo2");
        socket.emit("spo2Data", value.spo2);
        value.spo2=null
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
        connectToESP("temp");
        socket.emit("tempData", value.temp);
        value.temp=null
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
