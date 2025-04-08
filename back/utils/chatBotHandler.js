const Patient = require("../model/Patient");
// const getBotReply = require('./openAI');

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const user = socket.request.user;

    if (!user) {
      console.log("Unauthenticated socket connection");
      socket.disconnect();
      return;
    }

    console.log(`Socket connected: ${socket.id} as ${user}`);

    // Fetch patient data
    let patientData;
    try {
      patientData = await Patient.findById(user._id).populate("list").populate("med").select("-_id -uid");
    } catch (err) {
      console.error("Error fetching patient data:", err);
      socket.emit("bot-initial-response", "Error loading your health information.");
      return;
    }

    // Initial welcome
    const initialPrompt = "Greet the patient and summarize their current condition and medications.";
    try {
      const botResponse = "thanks for logging in";
      socket.emit("bot-initial-response", botResponse);
    } catch (err) {
      console.error("Bot error:", err);
      socket.emit("bot-initial-response", "Sorry, I couldn't process your health summary.");
    }

    // Chat message handler
    socket.on("user-message", async (message) => {
      try {
        const reply = "hi i am a bot";
        socket.emit("bot-response", reply);
      } catch (err) {
        console.error("Bot reply error:", err);
        socket.emit("bot-response", "Something went wrong. Try again later.");
      }
    });
  });
};
