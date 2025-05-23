const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const patientSchema = new mongoose.Schema({
  role: String,
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

  vitals: {
    heartRate: [{
      date: { type: String }, // e.g. '2025-04-10'
      time: { type: String }, // e.g. '14:30:22'
      data: { type: Number }
    }],
    SpO2: [{
      date: { type: String },
      time: { type: String },
      data: { type: Number }
    }],
    temperature: [{
      date: { type: String },
      time: { type: String },
      data: { type: Number }
    }]
  }  
  ,
  uid: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// ✅ Add Virtual `age`
patientSchema.virtual("age").get(function () {
  if (!this.DOB) return null;
  const ageDifMs = Date.now() - this.DOB.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// ✅ Include virtuals in JSON and Object outputs
patientSchema.set("toJSON", { virtuals: true });
patientSchema.set("toObject", { virtuals: true });

// ✅ Passport plugin
patientSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
