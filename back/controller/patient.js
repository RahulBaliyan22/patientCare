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
    res.status(200).json({ message: "User Info Updated Successfully.",patient });
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


const getVitalsData = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const numericLimit = parseInt(limit);

    const patient = await Patient.findById(req.user._id).select("vitals");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { heartRate = [], SpO2 = [], temperature = [] } = patient.vitals;

    const parseDateTime = (item) => {
      try {
        return new Date(`${item.date}T${item.time}`);
      } catch (err) {
        return new Date(0); // fallback to epoch if parsing fails
      }
    };

    const sortByDateTime = (data) =>
      [...data].sort((a, b) => parseDateTime(a) - parseDateTime(b)); // clone before sort

    const latestHeartRate = sortByDateTime(heartRate).slice(-numericLimit);
    const latestSpO2 = sortByDateTime(SpO2).slice(-numericLimit);
    const latestTemperature = sortByDateTime(temperature).slice(-numericLimit);

    res.status(200).json({
      message: "Vitals Data",
      heartRate: latestHeartRate,
      SpO2: latestSpO2,
      temperature: latestTemperature,
    });
  } catch (e) {
    console.error("Error fetching vitals:", e);
    res.status(500).json({ message: "Failed to fetch vitals data" });
  }
};



const addVitals = async (req, res) => {
  const { heartData, spo2data, tempdata } = req.body;

  try {
    const patient = await Patient.findById(req.user._id).select('vitals');

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0]; 
    const time = now.toTimeString().split(' ')[0]; 

    if (heartData !== undefined) {
      patient.vitals.heartRate.push({ data: heartData, date, time });
    }
    if (spo2data !== undefined) {
      patient.vitals.SpO2.push({ data: spo2data, date, time });
    }
    if (tempdata !== undefined) {
      patient.vitals.temperature.push({ data: tempdata, date, time });
    }

    await patient.save();

    res.status(200).json({ message: "Vitals added with date and time" });
  } catch (e) {
    console.error("Error adding vitals:", e);
    res.status(500).json({ message: "Failed to add vitals" });
  }
};





module.exports = { patientProfile, settings,getVitalsData,addVitals };
