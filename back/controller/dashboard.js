const Patient = require("../model/Patient");

const getDashboard = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User does not exist. Please log in." });
    }

    // Find the patient and populate their records, sorting by date in descending order, limiting to 5
    const patient = await Patient.findById(req.user._id).populate({
      path: "list",
      options: { sort: { date: -1 }, limit: 5 }, // Sort and limit directly in the query
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Extract the sorted and limited records
    const records = patient.list;

    res.status(200).json({
      message: "Records retrieved successfully.",
      records,
      patient,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getDashboard };
