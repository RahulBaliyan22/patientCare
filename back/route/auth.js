const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isVerified, isLoggedOut, validatePatient } = require("../middleware");

const {
  resetPass,
  forgotPasswordController,
  verifyContactemail,
  logout,
  signup,
  verifyemail,
} = require("../controller/auth");

router.post("/signup", isLoggedOut, validatePatient, signup);

router.post(
  "/login",
  isVerified,
  isLoggedOut,
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.status(200).json({ message: "Login successful", user: req.user });
  }
);

router.post("/logout", logout);

router.get("/verify-email", verifyemail);

router.get("/verify-contact-email", verifyContactemail);

router.post("/forgot-password", isLoggedOut, forgotPasswordController);

router.post("/reset-password/:token", resetPass);

module.exports = router;
