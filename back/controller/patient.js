const Patient = require("../model/Patient");

const Contact = require("../model/Contact");

const settings = async (req, res) => {
  const { name, email, phone, DOB, gender, bloodGroup, address } = req.body;

  // Simple validation to ensure required fields are present
  if (!name && !email && !phone && !DOB && !gender && !bloodGroup && !address) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }

  try {
    const patient = req.user;

    // Update patient fields only if new values are provided
    patient.name = name || patient.name;
    patient.email = email || patient.email;
    patient.phone = phone || patient.phone;
    patient.DOB = DOB || patient.DOB;
    patient.gender = gender || patient.gender;
    patient.bloodGroup = bloodGroup || patient.bloodGroup;
    patient.address = address || patient.address;

    // Save updated patient info
    await patient.save();
    console.log("save");
    res.status(200).json({ message: "User Info Updated Successfully." });
  } catch (e) {
    console.error(e); // Log error for debugging
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

const patientProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in." });
    }

    const patient = await Patient.findById(req.user._id)
      .populate({ path: "med", select: "name isEnd" })
      .populate({ path: "contacts" })
      .populate({ path: "hasPrimaryContact.primaryContact" })
      .lean();

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { patientProfile, settings };
