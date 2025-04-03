const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const hospitalSchema = new mongoose.Schema({
  role: String,
  name: {
    type: String,
    required: true
  },
  email: {  
    type: String,
    required: true,
    unique: true
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    }
  ],
  address: {
    type: String,
    unique: true
  }
});

hospitalSchema.plugin(passportLocalMongoose, {
  usernameField: "email" // Use email for authentication
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
