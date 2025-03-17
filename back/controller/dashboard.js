const Patient = require("../model/Patient");

const getDashboard = async (req, res) => {
  try {
    // Ensure the user is logged in
    if (!req.user) {
      return res.status(401).json({ message: "User does not exist. Please log in." });
    }

    // Find the patient and populate their records, sorted by date in descending order, limiting to 5
    const patient = await Patient.findById(req.user._id).populate({
      path: "list",
      select: "recordId name date", // Select only relevant fields
      options: { sort: { date: -1 }, limit: 5 }, // Sort by date descending and limit to 5 records
    });

    // If patient not found
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // If the patient has no records
    if (!patient.list || patient.list.length === 0) {
      return res.status(404).json({ message: "No records found." });
    }

    const records = patient.list;

    // Respond with the records and patient data
    res.status(200).json({
      message: "Records retrieved successfully.",
      records,
      patient,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { getDashboard };
