require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const initializeS3 = require("./config/s3");

// Routes and models
const authRoutes = require("./route/auth");
const dashboardRoutes = require("./route/dashboard");
const contactRoutes = require("./route/contact");
const recordRoutes = require("./route/record");
const patientRoutes = require("./route/patient");
const medicationRoutes = require("./route/medication");
const adminRoutes = require('./route/admin');
const Patient = require("./model/Patient");
const Admin = require("./model/Hospital");
const socketServer = require('./utils/chatBotHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://patient-care-ten.vercel.app",
    credentials: true,
  },
});

// Middleware setup
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "https://patient-care-ten.vercel.app", credentials: true }));

// MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));

// Session
const sessionMiddleware = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});
app.use(sessionMiddleware);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use('patient-local', Patient.createStrategy());
passport.use('admin-local', Admin.createStrategy());

passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (user, done) => {
  try {
    if (user.role === 'patient') {
      const patient = await Patient.findById(user.id);
      return done(null, patient);
    } else if (user.role === 'admin') {
      const admin = await Admin.findById(user.id);
      return done(null, admin);
    }
    return done(new Error("Invalid role"), null);
  } catch (err) {
    return done(err);
  }
});

// Enable session + passport on Socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, () => {
    passport.initialize()(socket.request, {}, () => {
      passport.session()(socket.request, {}, () => {
        next();
      });
    });
  });
});

// Socket.io logic
socketServer(io);

// Routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(contactRoutes);
app.use(recordRoutes);
app.use(patientRoutes);
app.use(medicationRoutes);
app.use("/admin", adminRoutes);

// Debug route
app.get("/check-session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.user || "Not logged in",
    cookies: req.cookies,
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
