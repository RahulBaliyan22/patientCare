const Record = require("../model/Record");
const Patient = require("../model/Patient");
const initializeS3 = require("../config/s3");
const path = require("path");

const s3 = initializeS3();
const bucketName = process.env.S3_BUCKET_NAME;

// Upload Image to S3
const uploadToS3 = async (file) => {
  const uploadParams = {
    Bucket: bucketName,
    Key: `records/${file.filename}`, // Folder inside S3 bucket
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Adjust permissions as needed
  };

  const uploadResult = await s3.upload(uploadParams).promise();
  return uploadResult.Location; // Return the S3 file URL
};

// Delete Image from S3
const deleteFromS3 = async (filePath) => {
  const key = filePath.split(".com/")[1]; // Extract key from URL
  await s3.deleteObject({ Bucket: bucketName, Key: key }).promise();
};

// 🟢 Add Record with S3 Image Upload
const addRecord = async (req, res) => {
  try {
    const { date, doctor, diagnosis, notes } = req.body;
    if (!date || !doctor) {
      return res.status(400).json({ message: "Date and doctor are required fields." });
    }

    // Upload each file to S3
    const images = await Promise.all(req.files.map(async (file) => ({
      filename: file.originalname,
      filePath: await uploadToS3(file), // Store S3 URL
    })));

    const newRecord = new Record({
      patient: req.user._id,
      date,
      doctor,
      diagnosis,
      notes,
      image: images,
    });

    const savedRecord = await newRecord.save();
    const patient = await Patient.findById(req.user._id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    patient.list.push(savedRecord._id);
    await patient.save();

    res.status(201).json({ message: "Record added successfully.", record: savedRecord });
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Delete Record (including S3 images)
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id).populate("patient");
    if (!record) return res.status(404).send("Record not found");

    // Remove from patient's list
    const patient = record.patient;
    patient.list = patient.list.filter((recId) => recId.toString() !== id);
    await patient.save();

    // Delete images from S3
    for (let img of record.image) {
      await deleteFromS3(img.filePath);
    }

    await Record.findByIdAndDelete(id);
    res.status(200).json({ message: "Record deleted." });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting record.");
  }
};

// 🟢 Delete Single Image from Record (S3)
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { filePath } = req.body;

    const record = await Record.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found." });

    const imageIndex = record.image.findIndex((img) => img.filePath === filePath);
    if (imageIndex === -1) return res.status(404).json({ message: "Image not found." });

    // Delete from S3
    await deleteFromS3(filePath);
    record.image.splice(imageIndex, 1);
    await record.save();

    res.status(200).json({ message: "Image deleted successfully." });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Failed to delete image.", error: err.message });
  }
};

module.exports = {
  addRecord,
  deleteRecord,
  deleteImage,
};
