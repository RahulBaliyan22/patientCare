const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Handles patient-related queries.
 * Responds to questions about health, medication, or app usage for a specific patient.
 */
const patientResponses = async (message, patient, context) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: `You are a helpful chatbot assistant for a patient care app (name = PatientCare)([yourName = PatientCare Assistant]).
Only respond to questions about the patient's health, medication, or app-related help.
Do not answer anything that is not health-related.
MOST IMPORTANT->[[Note:= GIVE ONLY MEDICAL AND PATIENT RELATED OUTPUTS NO OTHER THINGS STRICTLY DON'T TALK ABOUT ANY OTHER THING ONLY MEDICAL AND PatientCARE app]
Patient Info:
${JSON.stringify(patient)}
current patient records/medical records/reports:
${JSON.stringify(patient.list)}
current patient medications:
${JSON.stringify(patient.med)}
current patient Contacts:
${JSON.stringify(patient.contacts)}

Context:
${context}

Be professional and empathetic.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Patient response error:", err);
    return "Sorry, I couldn't generate a response at the moment.";
  }
};

/**
 * Handles admin-related queries.
 * Responds with insights about system status, user management, and analytics in the PatientCare app.
 */
const adminResponses = async (message, hospital, context) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: `You are an intelligent and professional assistant for the admin of a patient care app (name = PatientCare) ([yourName = PatientCare Assistant]).
You are assisting hospital administrators by providing insights about system performance, patient data summaries, departmental overviews, and app usage trends.
Do not provide medical advice or diagnose any conditions.
MOST IMPORTANT->[[Note:= GIVE ONLY MEDICAL AND PATIENT RELATED OUTPUTS NO OTHER THINGS STRICTLY DON'T TALK ABOUT ANY OTHER THING ONLY MEDICAL AND PatientCARE app]

Hospital Info:
${JSON.stringify(hospital)}
patient registered with current hospital:
${JSON.stringify(hospital.patients)}
Context:
${context}

Be concise, data-focused, and professional.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Admin response error:", err);
    return "Sorry, I couldn't generate an admin response at the moment.";
  }
};

/**
 * Handles general guest queries.
 * Responds to common questions about the app’s features, benefits, and how to get started.
 */
const guestResponses = async (message, context) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant on the PatientCare app for potential users.(yourName = PatientCare Assistant)
Answer questions about the app’s features, how to register, and general benefits.
Do not answer medical questions or anything that requires a registered account.
MOST IMPORTANT->[Note:= GIVE ONLY MEDICAL AND PATIENT RELATED OUTPUTS NO OTHER THINGS STRICTLY DON'T TALK ABOUT ANY OTHER THING ONLY MEDICAL AND PatientCARE app]
Context:
${context}

Be friendly and informative.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Guest response error:", err);
    return "Sorry, I couldn't generate a guest response at the moment.";
  }
};


const diagnosisResponses = async (texts) => {
  try {
    const prompt = `
You are a skilled medical assistant AI.
Your job is to analyze raw patient notes, prescriptions, and record summaries and infer:
- Key symptoms
- Possible diagnoses
- Recommended next step(s) (if any)

Only use medical knowledge. Do not make assumptions beyond the given data.

Patient Extracted Inputs:
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return a short, professional, and medically-aligned summary.
`;

    const completion = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [
        {
          role: "system",
          content: "You are a medical diagnosis assistant. Only give health-based insights.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Diagnosis response error:", err);
    return "Sorry, we couldn't analyze the diagnosis right now.";
  }
};
module.exports = {
  patientResponses,
  adminResponses,
  guestResponses,
  diagnosisResponses
};
