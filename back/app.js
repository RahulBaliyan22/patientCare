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

// Import routes
const authRoutes = require("./route/auth");
const dashboardRoutes = require("./route/dashboard");
const contactRoutes = require("./route/contact");
const recordRoutes = require("./route/record");
const patientRoutes = require("./route/patient");
const medicationRoutes = require("./route/medication");
const Patient = require("./model/Patient");
const adminRoutes = require('./route/admin');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://patient-care-ten.vercel.app",
    credentials: true,
  },
});

// Enable trust proxy for reverse proxies
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const s3 = initializeS3();
app.use(cors({ origin: "https://patient-care-ten.vercel.app", credentials: true }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));

// Session Configuration
const sessionMiddleware = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    expires: 24 * 60 * 60 * 1000,
  },
});
app.use(sessionMiddleware);

// Integrate Socket.io with session
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(Patient.createStrategy());
passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("health-data", (data) => {
    console.log("Received health data:", data);
    io.emit("update-health", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

// Routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(contactRoutes);
app.use(recordRoutes);
app.use(patientRoutes);
app.use(medicationRoutes);
app.use("/admin",adminRoutes);

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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
