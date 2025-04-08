const Patient = require("../model/Patient");
const getBotReply = require("../utils/openAI");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    const user = socket.request.user;
    console.log(user);
    if (!user || !user._id) {
      socket.emit("auth-error", "Unauthorized. Please log in.");
      socket.disconnect();
      return;
    }

    try {
      const patientData = await Patient.findById(user._id)
        .populate("list")
        .populate("med")
        .select("-_id");

      const initialPrompt =
        "Greet the patient and summarize their current condition and medications.";

      const initialReply = await getBotReply(initialPrompt, patientData);
      socket.emit("bot-initial-response", initialReply);
    } catch (err) {
      console.error("Error fetching patient or OpenAI:", err);
      socket.emit("bot-initial-response", "Unable to load your data.");
    }

    socket.on("user-message", async ({ message }) => {
      try {
        const patientData = await Patient.findById(user._id)
          .populate("list")
          .populate("med")
          .select("-_id");

        const botReply = await getBotReply(message, patientData);
        socket.emit("bot-response", botReply);
      } catch (err) {
        console.error("Bot response error:", err);
        socket.emit("bot-response", "Sorry, I couldn't respond at the moment.");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
