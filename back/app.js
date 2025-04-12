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
const webSocket = require('ws')
const wss = new WebSocket.Server({ server, path: "/esp32-ws" });
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
const {guestChat,patientChat,adminChat}  = require('./utils/chatBotHandler');
const {heartInfo,tempInfo,spoInfo} = require('./utils/vitalRealTime')


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://patient-care-ten.vercel.app",
    credentials: true,
  },
  transports: ["websocket"], // Force WebSocket
  allowEIO3: true, 
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
function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query?.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

// 🧠 This part ensures that during WebSocket upgrade (handshake), we extract the user from the session
io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.initialize()));
io.engine.use(onlyForHandshake(passport.session()));

io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      console.log("✅ WebSocket handshake user:", req.user);
      next();
    } else {
      console.log("❌ No user in WebSocket handshake");
      next();
    }
  }),
);

// Socket.io logic
guestChat(io);
patientChat(io)
adminChat(io)

heartInfo(io,wss)
tempInfo(io)
spoInfo(io)

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
