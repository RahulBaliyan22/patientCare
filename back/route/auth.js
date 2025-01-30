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
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed", error: err });
        }
        // After successful login, session cookie should be set
        return res.status(200).json({
          message: "Login successful",
          user: { id: user._id, email: user.email, name: user.name },
        });
      });
    })(req, res, next);
    
  }
);


router.post("/logout", logout);

router.get("/verify-email", verifyemail);

router.get("/verify-contact-email", verifyContactemail);

router.post("/forgot-password", isLoggedOut, forgotPasswordController);

router.post("/reset-password/:token", resetPass);

module.exports = router;
