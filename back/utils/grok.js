const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Handles patient-related queries.
 * Responds to questions about health, medication, or app usage for a specific patient.
 */
const patientResponses = async (message, patient, context) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [
        {
          role: "system",
          content: `You are a helpful, professional, and empathetic chatbot assistant named "PatientCare Assistant" for a healthcare app called "PatientCare".
Your job is to assist users with only the following:
- Their health
- Medications
- App-related help or usage issues

Strict Rules:
1. NEVER respond to non-medical or unrelated questions.
2. NEVER include <think> or any meta-cognitive descriptions — respond only like a real assistant in natural conversation.
3. ALWAYS remain professional, warm, and focused on patient care.
4. ONLY answer based on the patient's data or medical context provided below.

Patient Info:
${JSON.stringify(patient)}

Medical Records:
${JSON.stringify(patient.list)}

Current Medications:
${JSON.stringify(patient.med)}

Emergency Contacts:
${JSON.stringify(patient.contacts)}

Current Context:
${context}`
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
[NOTE:Strictly TO NOT give <THINK></THINK> only give a Conversational Reply]
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
[NOTE:Strictly TO NOT give <THINK></THINK> only give a Conversational Reply]
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
You are a skilled AI medical assistant.
You are provided with OCR-extracted patient records, prescriptions, or medical notes.

Analyze the text **strictly based on the given content**. Do not ask for more information or refer to any missing context.

Output a brief, medically-relevant summary covering:
- Symptoms or observations
- Possible diagnosis
- Suggested next medical step (if clear from the text)
if possible TRY DIAGNOSIS of Symptoms
Just focus on summarizing the medical meaning from the provided inputs.

Patient Records:
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}

NOTE:= [if text is not visible please try to give think what medical record is giving u using your ai and at end u can write please provide a more clear picture for a accurate response.]
Respond with only the medical analysis, no explanations or instructions.
    `;

    const completion = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [
        {
          role: "system",
          content: "You are a medical analysis assistant. Only give health-based summaries from input data.",
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
