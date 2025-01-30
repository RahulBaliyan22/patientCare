require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./route/auth");
const dashboardRoutes = require("./route/dashboard");
const passport = require("passport");
const session = require("express-session");
const Patient = require("./model/Patient");
const LocalStrategy = require('passport-local')
const contactRoutes = require("./route/contact");
const recordRoutes = require("./route/record");
const patientRoutes = require("./route/patient");
const medicationRoutes = require("./route/medication");
const path = require("path");
const MongoStore = require('connect-mongo');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS options
const corsOptions = {
  origin: process.env.REACT_APP_URL || "https://patient-care-ten.vercel.app", 
  credentials: true,
}
app.use(cors(corsOptions));

const url =
  process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log(`connected to Db`);
  })
  .catch((e) => {
    console.log(`error ${e}`);
  });
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
      cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // True for production only
        sameSite: 'None',  // Allow cross-origin cookies
        path: '/',
        domain: '.vercel.app',  // Make sure this matches your domain
        maxAge: 604800000, // 7 days
      },
    })
  );
  
  
  

// Initialize passport
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(Patient.createStrategy());

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);  // Log the user object
  done(null, user._id);  // Store the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user ID:', id);  // Log the ID being deserialized
    const user = await Patient.findById(id);  // Retrieve the user from the database
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});



app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(recordRoutes);
app.use(patientRoutes);
app.use(medicationRoutes);
app.use(contactRoutes);
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`connected to server at ${PORT}`);
});
