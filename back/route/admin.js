const express = require("express");
const passport = require("passport"); // Missing import
const { 
  isLoggedIn, isLoggedOut, isAdmin, validateHospital, validatePatient, 
  validateRecords, validateMedication 
} = require("../middleware");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const initializeS3 = require("../config/s3");
const { 
  signup, login, logout, addPatient, getPatient, 
  getPatients, getPatientById, addRecord, updateRecord, 
  addMed, updateMed , getHospitals,updateProfile
} = require("../controller/admin");

const s3 = initializeS3();

// Configure Multer-S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `patient-records/${Date.now()}-${file.originalname}`);
    },
  }),
});

//get all hospitals
router.get("/gethospitals",getHospitals);

// Auth Routes
router.post("/signup", isLoggedOut, validateHospital, signup);
router.post("/login", isLoggedOut,passport.authenticate("admin-local"), isAdmin, login);
router.post("/logout",isLoggedIn,isAdmin, logout);

// Patient Routes
router.post("/add-patient", isLoggedIn, isAdmin, addPatient);
router.get("/getpatient/me", isLoggedIn, isAdmin, getPatientById); // Better clarity
router.get("/getpatient/:patientId", isLoggedIn, isAdmin, getPatient);
router.get("/getpatients", isLoggedIn, isAdmin, getPatients);

// Patient Records Routes
router.post("/add-record/:patientId", isLoggedIn, isAdmin, upload.array("images"), validateRecords, addRecord);
router.put("/update-record/:recordId", isLoggedIn, isAdmin, upload.array("images"), updateRecord);

// Medication Routes
router.post("/add-Med/:patientId", isLoggedIn, isAdmin, validateMedication, addMed);
router.put("/update-Med/:medId", isLoggedIn, isAdmin, updateMed);

//update profile
router.put("/update",isLoggedIn,isAdmin,updateProfile)

module.exports = router;
