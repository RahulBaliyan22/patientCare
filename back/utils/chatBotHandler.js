const Patient = require("../model/Patient");
const Hospital = require("../model/Hospital.js");

const { authorizeRole } = require('../middleware');
const {
  patientResponses,
  adminResponses,
  guestResponses,
} = require("./grok.js");

const guestChat = (io) => {
  const chatNamespace = io.of("/chat-guest");

  chatNamespace.on("connection", async (socket) => {
    console.log("🟢 Guest connected");

    socket.on("guest:send-message", async (message) => {
      try {
        const context = "General inquiries about the app";
        const response = await guestResponses(message, context);
        socket.emit("guest:receive-response", response);
      } catch (err) {
        console.error("Guest response error:", err);
        socket.emit("guest:receive-response", "Sorry, an error occurred.");
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Guest user disconnected");
    });
  });
};

const patientChat = (io) => {
  const chatNamespace = io.of("/chat-patient");

  chatNamespace.use(authorizeRole("patient"));
  chatNamespace.on("connection", async (socket) => {
    console.log("🟢 Patient connected");

    const patientId = socket.request.user?._id;
    const patient = await Patient.findById(patientId);

    socket.on("patient:send-message", async (message) => {
      try {
        const context = "Patient asking about health, medication, or app help";
        const response = await patientResponses(message, patient, context);
        socket.emit("patient:receive-response", response);
      } catch (err) {
        console.error("Patient response error:", err);
        socket.emit("patient:receive-response", "Sorry, an error occurred.");
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Patient user disconnected");
    });
  });
};

const adminChat = (io) => {
  const chatNamespace = io.of("/chat-admin");

  chatNamespace.use(authorizeRole("admin"));
  chatNamespace.on("connection", async (socket) => {
    console.log("🟢 Admin connected");

    const adminId = socket.request.user?._id;
    const hospital = await Hospital.findOne({ admin: adminId }).populate("patients");

    socket.on("admin:send-message", async (message) => {
      try {
        const context = "Admin asking for hospital analytics, system status, or patient summary";
        const response = await adminResponses(message, hospital, context);
        socket.emit("admin:receive-response", response);
      } catch (err) {
        console.error("Admin response error:", err);
        socket.emit("admin:receive-response", "Sorry, an error occurred.");
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Admin user disconnected");
    });
  });
};

module.exports = { guestChat, patientChat, adminChat };
