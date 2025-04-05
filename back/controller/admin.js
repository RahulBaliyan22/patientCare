const Hospital = require("../model/Hospital");
const Patient = require("../model/Patient");
const Medication = require("../model/Medication");
const Record = require("../model/Record")
const signup = async (req, res) => {
  const { name, password, email, address } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if email already exists
    const existingUser = await Hospital.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use. Choose another." });
    }

    // Check if address already exists
    const existingAddress = await Hospital.findOne({ address });
    if (existingAddress) {
      return res.status(400).json({ message: "Address already in use. Each hospital must have a unique address." });
    }

    // Create new hospital entry
    const hospital = new Hospital({
      role: "admin",
      name,
      email,
      address,
    });

    await Hospital.register(hospital, password); // PLM handles password hashing & salting

    res.status(201).json({ message: "Hospital registered successfully." });

  } catch (err) {
    console.error("Signup error:", err);

    // Handling duplicate key errors from MongoDB
    if (err.code === 11000) {
      if (err.keyPattern?.email) {
        return res.status(400).json({ message: "Email already in use. Choose another." });
      }
      if (err.keyPattern?.address) {
        return res.status(400).json({ message: "Address already in use. Each hospital must have a unique address." });
      }
    }

    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const login = (req, res) => {
  res.json({ message: "Login successful", user: req.user });
};

const logout = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error });
  }
};

const addPatient = async (req, res) => {
  const { patientId } = req.query;

  try {
    // Ensure hospital exists
    const hospital = await Hospital.findById(req.user._id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Prevent duplicate patient entries
    if (hospital.patients.includes(patientId)) {
      return res.status(400).json({ message: "Patient already added" });
    }

    // Add patient to hospital
    hospital.patients.push(patientId);
    await hospital.save();

    res.status(200).json({ message: "Patient added successfully", hospital });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const getPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Find patient and populate `med` and `hasPrimaryContact.primaryContact`
    const patient = await Patient.findById(patientId)
      .populate("med") // Populating the medication field
      .populate("list"); // Populating the primary contact

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const getPatients = async (req, res) => {
  try {
    // Find all patients and populate `med` and `hasPrimaryContact.primaryContact`
    const patients = await Patient.find({})
      .populate("med") // Populating the medication field
      .populate("list"); // Populating the primary contact

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const getPatientById = async (req, res) => {
  const { patientId } = req.query;
  
  try {
    const patient = await Patient.findOne({ uid: patientId })
      .populate("med")
      .populate("list");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    let isAdded = req.user.patients.includes(patient._id);

    res.status(200).json({ patient, isAdded });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const addRecord = async (req, res) => {
  const { patientId } = req.params;

  try {
    const { date, doctor, diagnosis, notes } = req.body;

    if (!date || !doctor) {
      return res.status(400).json({ message: "Date and doctor are required fields." });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Handle uploaded files safely
    const images = req.files?.map((file) => ({
      filename: file.originalname,
      filePath: file.location,
    })) || [];

    // Create a new medical record
    const newRecord = new Record({
      patient: patientId,
      date: parsedDate.toISOString(),
      doctor,
      diagnosis,
      notes,
      image: images,
      hospital: req.user?._id || null, // Ensure hospital ID is valid
    });

    const savedRecord = await newRecord.save();

    // Link the record to the patient efficiently
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $push: { list: savedRecord._id } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(201).json({ message: "Record added successfully.", record: savedRecord });
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const updateRecord = async (req, res) => {
  const { recordId } = req.params;
  let { date, doctor, diagnosis, notes } = req.body;

  try {
    // Validate date if provided
    let formattedDate = date ? new Date(date) : null;
    if (formattedDate && isNaN(formattedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Prepare uploaded images
    const uploadedImages = req.files?.map((file) => ({
      filename: file.originalname,
      filePath: file.location, // `file.location` is provided by multer-s3
    })) || [];

    // Find and update record in one query
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      {
        $set: {
          date: formattedDate ? formattedDate.toISOString() : undefined,
          doctor: doctor || undefined,
          diagnosis: diagnosis || undefined,
          notes: notes || undefined,
          hospital: req.user._id,
        },
        $push: { image: { $each: uploadedImages } },
      },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json({ message: "Record updated successfully", record: updatedRecord });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ message: "Failed to update record", error: err.message });
  }
};

const addMed = async (req, res) => {
  const { patientId } = req.params;
  try {
    const { name, start, end, prescribedBy, dosage } = req.body;
    
    // Find patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Basic validation
    if (!name || !start) {
      return res.status(400).json({
        message: "Please provide required fields: 'name' and 'start'.",
      });
    }

    // Construct medication object
    const med = new Medication({
      name,
      start,
      end: end || null,
      prescribedBy,
      dosage,
      hospital: req.user._id,
      isEnd: end ? new Date(end) <= new Date() : false, // Sets isEnd directly
    });

    // Save to database
    const savedMed = await med.save();
    
    // Link medication to patient
    patient.med.push(savedMed._id);
    await patient.save();

    // Success response
    return res.status(201).json({
      message: "Medication entry created successfully.",
      medication: savedMed,
    });

  } catch (error) {
    console.error("Error creating medication entry:", error);
    return res.status(500).json({
      message: "An error occurred while creating the medication entry.",
      error: error.message,
    });
  }
};

const updateMed = async (req, res) => {
  const { medId } = req.params;
    const { start, end, name, prescribedBy, dosage } = req.body;
  
    try {
      const medication = await Medication.findById(medId);
  
      if (!medication) {
        return res.status(404).json({ message: "Medication not found." });
      }
      if (start) medication.start = start;
      if (end) {
        medication.end = end;
      } else {
        medication.end = null;
      }
      if (name) medication.name = name;
      if (prescribedBy) medication.prescribedBy = prescribedBy;
      if (dosage) medication.dosage = dosage;
      if (end) {
        medication.isEnd = true;
      } else {
        medication.isEnd = false;
      }
  
      medication.hospital = req.user._id;
      await medication.save();
  
      res.status(200).json({
        message: "Medication updated successfully.",
        medication,
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        message: "An error occurred while updating the medication.",
        error,
      });
    }
  };

 
  const getHospitals = async (req, res) => {
    try {
      const hospitals = await Hospital.find({}).select("name address").lean();
  
      res.status(200).json({
        message: "Hospitals fetched successfully",
        hospitals,
      });
    } catch (e) {
      console.error("Error fetching hospitals:", e);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = { 
  signup, 
  login, 
  logout, 
  addPatient, 
  getPatient, 
  getPatients, 
  getPatientById, 
  addRecord, 
  updateRecord, 
  addMed, 
  updateMed,
  getHospitals
};

