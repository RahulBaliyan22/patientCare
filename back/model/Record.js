const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
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
    required: false,
    trim: true,
  },
  notes: {
    type: String,
    required: false,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
