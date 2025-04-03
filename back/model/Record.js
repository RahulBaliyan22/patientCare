const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {hospital:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Hospital"
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true, // Ensuring each record belongs to a patient
    },
    date: {
      type: Date,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      trim: true, // Ensuring unnecessary spaces are removed
    },
    notes: {
      type: String,
      trim: true,
    },
    image: [
      {
        filename: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt' fields automatically
);

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
