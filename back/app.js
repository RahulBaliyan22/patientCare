require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import routes
const authRoutes = require("./route/auth");
const dashboardRoutes = require("./route/dashboard");
const contactRoutes = require("./route/contact");
const recordRoutes = require("./route/record");
const patientRoutes = require("./route/patient");
const medicationRoutes = require("./route/medication");
const Patient = require("./model/Patient");

// Enable trust proxy for reverse proxies (e.g., Vercel, Nginx)
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin:"https://patient-care-ten.vercel.app",
  credentials: true,
};
app.use(cors(corsOptions));

// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      expires: 24 * 60*60*1000
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(Patient.createStrategy());
passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

// Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(contactRoutes);
app.use(recordRoutes);
app.use(patientRoutes);
app.use(medicationRoutes);

// Debugging Route to Check Cookies and Session
app.get("/check-session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.user || "Not logged in",
    cookies: req.cookies,
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
