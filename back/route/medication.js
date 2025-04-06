const express = require("express");
const { isLoggedIn, validateMedication,isPatient } = require("../middleware");
const {
  updateOneMed,
  deleteMed,
  updateMedEnd,
  fetchOneMed,
  addMed,
  fetchMed,
} = require("../controller/medication");
const router = express.Router();

router.get("/med", isLoggedIn,isPatient, fetchMed);

router.post("/med", isLoggedIn, validateMedication, addMed);

router.get("/med/:id", isLoggedIn,isPatient, fetchOneMed);

router.patch("/med/end/:id", isLoggedIn,updateMedEnd);

router.delete("/med/delete/:id", isLoggedIn ,isPatient, deleteMed);

router.patch("/med/update/:id", isLoggedIn , validateMedication, updateOneMed);

module.exports = router;
