const express = require("express");
const { isLoggedIn, validatePatient,isPatient } = require("../middleware");
const router = express.Router();
const { patientProfile, settings,getVitalsData,addVitals } = require("../controller/patient");

router.put("/update", isLoggedIn, isPatient,validatePatient, settings);

router.get("/patient", isLoggedIn,isPatient, patientProfile);

router.get('/vitals/data',isLoggedIn,isPatient,getVitalsData);

router.post('/vitals/add',isLoggedIn,isPatient,addVitals)

module.exports = router;
