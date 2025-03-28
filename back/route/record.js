const express = require("express");
const router = express.Router();
const { isLoggedIn, validateRecords } = require("../middleware");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3Config"); // Import AWS S3 configuration

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

// Configure Multer-S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read", // Can be changed to "private" if needed
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `patient-records/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Routes
router.post("/add-record", isLoggedIn, upload.array("images"), validateRecords, addRecord);
router.get("/records", isLoggedIn, fetchRecord);
router.get("/records/:id", isLoggedIn, fetchOneRecord);
router.delete("/delete/:id", isLoggedIn, deleteRecord);
router.post("/record/send-email/:id", isLoggedIn, sendOneRecord);
router.delete("/delete-image/:id", isLoggedIn, deleteImage);
router.put("/records/:id", isLoggedIn, upload.array("images"), validateRecords, updateRecord);
router.post("/records/send-email", isLoggedIn, sendRecords);

module.exports = router;
