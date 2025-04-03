const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controller/dashboard");
const { isLoggedIn,isPatient } = require("../middleware");

router.get("/dashboard", isLoggedIn,isPatient, getDashboard);

module.exports = router;
