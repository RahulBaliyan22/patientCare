const { schemaMedication, schemaContact, schemaPatient, schemaRecords,schemaHospital } = require("./ssv");
const Patient = require("./model/Patient");

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};

const isPatient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (req.user.role === "patient") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Patient privileges required." });
  }
};

const validateMiddleware = (schema, requiredFields) => {
  return (req, res, next) => {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    // Allow extra fields like "password" by setting `{ allowUnknown: true }`
    const { error } = schema.validate(req.body, { allowUnknown: true });

    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return res.status(400).json({ message: "Validation Error", details: error.details[0].message });
    }

    next();
  };
};

const validateHospital = validateMiddleware(schemaHospital, ["name", "email", "address"]);
const validateMedication = validateMiddleware(schemaMedication, ["name", "start"]);
const validateContact = validateMiddleware(schemaContact, ["name", "phone", "email"]);
const validatePatient = validateMiddleware(schemaPatient, ["name", "email", "phone"]);
const validateRecords = validateMiddleware(schemaRecords, ["date", "doctor"]);

const isVerified = async (req, res, next) => {
  try {
    const { email } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!patient.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    next();
  } catch (error) {
    console.error("Error checking email verification:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ message: "You are already logged in. Please log out first." });
  }
  next();
};

module.exports = {
  isAdmin,
  isPatient,
  isVerified,
  isLoggedIn,
  isLoggedOut,
  validateMedication,
  validateContact,
  validatePatient,
  validateRecords,
  validateHospital
};
