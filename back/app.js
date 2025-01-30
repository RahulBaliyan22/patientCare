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
};



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
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
      cookie: {
        httpOnly: true,  
        secure: true,  
        sameSite: 'None',  
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );
  
  

// Initialize passport
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(Patient.createStrategy());

passport.serializeUser(Patient.serializeUser()); 
passport.deserializeUser(Patient.deserializeUser()); 

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
