const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const patientSchema = new mongoose.Schema({
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  DOB: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: false,
  },
  bloodGroup: {
    type: String,
    enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  isFirstTimeUser: {
    type: Boolean,
    default: true,
  },
  hasPrimaryContact: {
    isPrimary: {
      type: Boolean,
      default: false,
    },
    primaryContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
  },
  lastLogin: { type: Date, default: null },
  med: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },
  ],
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Adding passport-local-mongoose methods
patientSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
