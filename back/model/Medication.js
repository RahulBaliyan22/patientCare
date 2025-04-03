const mongoose = require("mongoose");
const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: false,
  },
  isEnd: {
    type: Boolean,
    default: false,
  },
  dosage: {
    type: String,
    required: false,
  },
  hospital:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Hospital"
  },
  prescribedBy: {
    type: String,
    required: false,
  },
});

const Medication = mongoose.model("Medication", medicationSchema);

module.exports = Medication;
