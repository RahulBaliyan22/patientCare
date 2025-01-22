const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controller/dashboard");
const { isLoggedIn } = require("../middleware");

router.get("/dashboard", isLoggedIn, getDashboard);

module.exports = router;
