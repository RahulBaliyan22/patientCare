const Contact = require("../model/Contact");
const askContact = require("../utils/ackContact");
const forgotPassword = require("../utils/forgotPassword");
const Patient = require("../model/Patient");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const signup = async (req, res) => {
  const { email, password, name, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user using passport-local-mongoose's register method
    const user = new Patient({
      email,
      name,
      phone,
      verificationToken,
    });

    // Use passport-local-mongoose's register method to hash the password and save the user
    Patient.register(user, password, async (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error registering user", error: err });
      }

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      // Save the user after registration
      await user.save();

      res.status(201).json({
        message:
          "User registered successfully. Please verify your email to log in.",
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

const logout = async (req, res) => {
  try {
    // If you are storing isFirstVisited in the session or database, update it accordingly
    if (req.user) {
      req.user.isFirstTimeUser = false;
      req.user.lastLogin = new Date();
      await req.user.save(); // Save changes to the database if using a model like Mongoose
    }

    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error });
  }
};

const verifyemail = async (req, res) => {
  const { token } = req.query;

  try {
    // Find the user with the verification token
    const user = await Patient.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the user's isVerified property to true
    user.isVerified = true;
    user.verificationToken = null; // Clear the verification token after successful verification

    await user.save();
    res.redirect(
      "http://localhost:5173/login?message=Email successfully verified! You can now log in."
    );
  } catch (err) {
    res.status(500).json({ message: "Error verifying email", error: err });
  }
};

const verifyContactemail = async (req, res) => {
  const { token, verifier, isPrimary } = req.query;

  try {
    const contact = await Contact.findOne({ verificationToken: token });
    if (!contact) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const patient = await Patient.findOne({ email: verifier }).populate(
      "contacts"
    );
    if (!patient) {
      return res.status(404).json({ message: "Verifier (Patient) not found." });
    }

    if(patient.hasPrimaryContact.isPrimary){
      await Contact.findByIdAndUpdate(patient.hasPrimaryContact.primaryContact,{$set:{isPrimary:false}})
    }
    // If `isPrimary` is true, reset primary contact and update patient's primary contact field
    if (isPrimary === "true") {
      patient.hasPrimaryContact = {
        isPrimary: true,
        primaryContact: contact._id,
      };
      contact.isPrimary = true;
    }

    // Update the contact's verification and primary status
    contact.isVerified = true;
    contact.verificationToken = null;

    
    await contact.save();

    await patient.save();
    await askContact(contact, verifier);

    res.status(200).json({ message: "Verification successful." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying contact email", error: error.message });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await Patient.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account with that email found." });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString("hex");

    // Set token and expiry in user model
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Configure nodemailer
    await forgotPassword(user, token);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending password reset email." });
  }
};

const resetPass = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token and check if it's still valid
    const user = await Patient.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update the password and clear the token fields
    await user.setPassword(password); // Passport-Local Mongoose method
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password." });
  }
};

module.exports = {
  resetPass,
  forgotPasswordController,
  verifyContactemail,
  logout,
  signup,
  verifyemail,
};
