const express = require("express");
const { isLoggedIn, validatePatient } = require("../middleware");
const router = express.Router();
const { patientProfile, settings } = require("../controller/patient");

router.put("/update", isLoggedIn, validatePatient, settings);

router.get("/patient", isLoggedIn, patientProfile);

module.exports = router;
