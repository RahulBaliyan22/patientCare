const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const initializeS3 = require("../config/s3");
const { isLoggedIn, validateRecords,isPatient } = require("../middleware");
const {
  addRecord,
  fetchRecord,
  fetchOneRecord,
  updateRecord,
  deleteRecord,
  sendOneRecord,
  sendRecords,
  deleteImage,
} = require("../controller/record");

// Initialize S3 instance
const s3 = initializeS3();

// Configure Multer-S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3, // Pass the S3Client instance correctly
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically detect MIME type
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `patient-records/${Date.now()}-${file.originalname}`);
    },
  }),
});


// Routes
router.post("/add-record", isLoggedIn, upload.array("images"), validateRecords,addRecord);
router.get("/records", isLoggedIn,isPatient, fetchRecord);
router.get("/records/:id", isLoggedIn, isPatient,fetchOneRecord);
router.put("/records/:id", isLoggedIn, upload.array("images"), validateRecords,updateRecord);
router.delete("/delete/:id", isLoggedIn,isPatient, deleteRecord);
router.post("/record/send-email/:id", isLoggedIn,isPatient, sendOneRecord);
router.post("/records/send-email", isLoggedIn,isPatient, sendRecords);
router.delete("/delete-image/:id", isLoggedIn,isPatient, deleteImage);

module.exports = router;