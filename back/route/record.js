const express = require("express");
const router = express.Router();
const { isLoggedIn, validateRecords } = require("../middleware");
const multer = require("multer");

const {
  sendRecords,
  updateRecord,
  deleteImage,
  sendOneRecord,
  deleteRecord,
  fetchOneRecord,
  fetchRecord,
  addRecord,
} = require("../controller/record");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/add-record",
  isLoggedIn,
  
  upload.array("images"),
  validateRecords,
  addRecord
);

router.get("/records", isLoggedIn, fetchRecord);

router.get("/records/:id", isLoggedIn, fetchOneRecord);

router.delete("/delete/:id", isLoggedIn, deleteRecord);

router.post("/record/send-email/:id", isLoggedIn, sendOneRecord);

router.delete("/delete-image/:id", isLoggedIn, deleteImage);

router.put(
  "/records/:id",
  isLoggedIn,
  upload.array("images"),
  validateRecords,
  updateRecord
);

router.post("/records/send-email", isLoggedIn, sendRecords);
module.exports = router;
