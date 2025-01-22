const express = require("express");
const { isLoggedIn, validateMedication } = require("../middleware");
const {
  updateOneMed,
  deleteMed,
  updateMedEnd,
  fetchOneMed,
  addMed,
  fetchMed,
} = require("../controller/medication");
const router = express.Router();

router.get("/med", isLoggedIn, fetchMed);

router.post("/med", isLoggedIn, validateMedication, addMed);

router.get("/med/:id", isLoggedIn, fetchOneMed);

router.patch("/med/end/:id", isLoggedIn, updateMedEnd);

router.delete("/med/delete/:id", isLoggedIn, deleteMed);

router.patch("/med/update/:id", isLoggedIn, validateMedication, updateOneMed);

module.exports = router;
