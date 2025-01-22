// isVerified middleware
const {
  schemaMedication,
  schemaContact,
  schemaPatient,
  schemaRecords,
} = require("./ssv");

const Patient = require("./model/Patient");

const validateMedication = (req, res, next) => {
  const { name, start, end, prescribedBy, dosage } = req.body;
  const { error, value } = schemaMedication.validate({
    name,
    start
  });

  if (error) {
    console.log(error.details)
    return res.status(400).json({
      message: "Validation Error",
      details: error.details,
    });
  }

  next();
};

const validateContact = (req, res, next) => {
  const { name, phone, email, isPrimary } = req.body;
  const { error, value } = schemaContact.validate({
    name,
    phone,
    email
  });

  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({
      message: "Validation Error",
      details: error.details,
    });
  }

  next();
};

const validatePatient = (req, res, next) => {
  const { name, email, phone, DOB, gender, bloodGroup, address } = req.body;
  const { error, value } = schemaPatient.validate({
    name,
    email,
    phone,
    DOB,
    gender,
    bloodGroup,
  });

  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({
      message: "Validation Error",
      details: error.details,
    });
  }

  next();
};

const validateRecords = (req, res, next) => {
  const { date, doctor, diagnosis, notes } = req.body;
 
  const { error, value } = schemaRecords.validate({
    date,
    doctor,
  });

  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({
      message: "Validation Error",
      details: error.details,
    });
  }

  next();
};

const isVerified = async (req, res, next) => {
  const { email } = req.body; // Access email from the request body

  try {
    const patient = await Patient.findOne({ email }); // Find the patient by email

    if (!patient) {
      return res.status(404).json({ message: "User not found" }); // User not found
    }

    if (!patient.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email to log in" }); // Email not verified
    }

    // Proceed to the next middleware if the email is verified
    next();
  } catch (error) {
    console.error("Error checking email verification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Please log in first" }); // 401 Unauthorized
  }
  next(); // Proceed to the next middleware or route handler
};

const isLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).json({ message: "Please log out first" }); // 401 Unauthorized
  }
  next(); // Proceed to the next middleware or route handler
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
