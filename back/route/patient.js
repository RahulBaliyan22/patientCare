const express = require("express");
const { isLoggedIn, validatePatient,isPatient } = require("../middleware");
const router = express.Router();
const { patientProfile, settings } = require("../controller/patient");

router.put("/update", isLoggedIn, isPatient,validatePatient, settings);

router.get("/patient", isLoggedIn,isPatient, patientProfile);

module.exports = router;
