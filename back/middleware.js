const { schemaMedication, schemaContact, schemaPatient, schemaRecords } = require("./ssv");
const Patient = require("./model/Patient");

const validateMedication = (req, res, next) => {
  const { name, start, end, prescribedBy, dosage } = req.body;
  if (!name || !start) {
    return res.status(400).json({ message: "Name and start date are required" });
  }
  
  const { error } = schemaMedication.validate({ name, start });
  if (error) {
    console.log(error.details);
    return res.status(400).json({ message: "Validation Error", details: error.details });
  }

  next();
};

const validateContact = (req, res, next) => {
  const { name, phone, email, isPrimary } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ message: "Name, phone, and email are required" });
  }

  const { error } = schemaContact.validate({ name, phone, email });
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ message: "Validation Error", details: error.details });
  }

  next();
};

const validatePatient = (req, res, next) => {
  const { name, email, phone, DOB, gender, bloodGroup, address } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email, and phone are required" });
  }

  const { error } = schemaPatient.validate({ name, email, phone, DOB, gender, bloodGroup });
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ message: "Validation Error", details: error.details });
  }

  next();
};

const validateRecords = (req, res, next) => {
  const { date, doctor, diagnosis, notes } = req.body;
  if (!date || !doctor) {
    return res.status(400).json({ message: "Date and doctor are required" });
  }

  const { error } = schemaRecords.validate({ date, doctor });
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ message: "Validation Error", details: error.details });
  }

  next();
};

const isVerified = async (req, res, next) => {
  const { email } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!patient.isVerified) {
      return res.status(400).json({ message: "Please verify your email to log in" });
    }

    next();
  } catch (error) {
    console.error("Error checking email verification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Please log in first" });
  }

  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).json({ message: "Please log out first" });
  }

  next();
};

module.exports = {
  isVerified,
  isLoggedIn,
  isLoggedOut,
  validateMedication,
  validateContact,
  validatePatient,
  validateRecords,
};
