const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (message, patient, context) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful chatbot assistant for a patient care app(name = PatientCare). Only respond to questions about patient health, medication, or app help. Do not respond to anything not health-related.\n\nPatient Info:\n${JSON.stringify(patient)}\nContext:\n${context} and be professional.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI error:", err);
    return "Sorry, I couldn't generate a response at the moment.";
  }
};
