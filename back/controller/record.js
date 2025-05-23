const Record = require("../model/Record");
const Patient = require("../model/Patient");
const sendRecordEmail = require("../utils/sendRecordEmail");
const sendRecordsEmail = require("../utils/sendRecordsEmail");
const initializeS3 = require("../config/s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { diagnosisResponses } = require("../utils/grok");
const { createWorker }  = require('tesseract.js')
const sharp = require('sharp');
const axios = require('axios');
const s3 = initializeS3();
const addRecord = async (req, res) => {
  try {
    const { date, doctor, diagnosis, notes, isScript } = req.body;

    if (!date || !doctor) {
      return res.status(400).json({ message: "Date and doctor are required fields." });
    }

    // Ensure files were uploaded
    const images = req.files ? req.files.map((file) => ({
      filename: file.originalname, 
      filePath: file.location, 
    })) : [];

    // Update first-time user flag
    if (req.user.isFirstTimeUser) {
      req.user.isFirstTimeUser = false;
      await req.user.save();
    }

    // Create a new medical record
    const newRecord = new Record({
      patient: req.user._id,
      date,
      doctor,
      diagnosis,
      notes,
      image: images,
    });

    if(isScript){
      const preprocessImage = async (imageInput) => {
        let imageBuffer;
      
        // Load image from local path or remote URL
        if (imageInput.startsWith('http')) {
          const res = await axios.get(imageInput, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(res.data);
        } else {
          imageBuffer = await sharp(imageInput).toBuffer();
        }
      
        // Apply preprocessing
        const processedImage = await sharp(imageBuffer)
          .rotate() // Auto-orientation based on EXIF
          .resize({ width: 1600 }) // Upscale for better clarity
          .grayscale()
          .normalize() // Stretch contrast (useful for faded text)
          .threshold(160) // Binarize the image (good for OCR)
          .toBuffer();
      
        return processedImage;
      };
      
      const imgToText = async (files) => {
        const worker = await createWorker('eng+hin');
      
        const results = await Promise.all(
          files.map(async (file) => {
            try {
              const input = file.location || file.path;
              const processedImage = await preprocessImage(input);
              const { data: { text } } = await worker.recognize(processedImage);
              return text;
            } catch (err) {
              console.error('OCR failed for:', file, err.message);
              return '';
            }
          })
        );
      
        await worker.terminate();
        return results;
      };
      
      const texts = req.files?await imgToText(req.files):[];
      newRecord.script = await diagnosisResponses(texts);
    }

    const savedRecord = await newRecord.save();

    // Link the record to the patient
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


const fetchRecord = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User does not exist. Please log in." });
    }

    // Find the patient and populate their records, sorting by date in descending order
    const patient = await Patient.findById(req.user._id)
      .populate([
        { path: "list", options: { sort: { date: -1 } } }, // Ensure date is stored as a Date object
        { path: "contacts" },
        { path: "hasPrimaryContact.primaryContact" },
      ]);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Extract sorted records (Ensure it's an array)
    const records = patient.list || [];

    res.status(200).json({
      message: "Records retrieved successfully.",
      records,
      contacts: patient.contacts,
      primary: patient.hasPrimaryContact,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const fetchOneRecord = async (req, res) => {
  try {
    const { id } = req.params; // Correct way to access URL parameter
    const patient = await Patient.findById(req.user._id)
      .populate({ path: "hasPrimaryContact.primaryContact" })
      .populate({ path: "contacts" });
    const record = await Record.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Record does not exist" });
    }

    res.status(200).json({
      message: "Record fetched successfully",
      record,
      primary: patient.hasPrimaryContact,
      contacts: patient.contacts,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};


const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the record and populate patient details
    const record = await Record.findById(id).populate("patient");
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    const patient = record.patient;
    const recordIndex = patient.list.indexOf(record._id);
    if (recordIndex > -1) {
      patient.list.splice(recordIndex, 1); // Remove the record ID from the list
      await patient.save();
      console.log(`Removed record ID ${id} from patient's list`);
    }

    // Delete images from S3
    for (let obj of record.image) {
      const fileKey = obj.filePath.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`, ''); // Extract the key from the S3 URL
      console.log(`Deleting file from S3: ${fileKey}`);
      
      try {
        const deleteParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
        };
        
        try {
          const response = await s3.send(new DeleteObjectCommand(deleteParams));
          console.log("S3 Delete Response:", response);
        } catch (err) {
          console.error("S3 Delete Error:", err);
        }
        console.log(`Deleted file from S3: ${fileKey}`);
      } catch (err) {
        console.error(`Error deleting file from S3: ${fileKey}`, err.message);
      }
    }

    // Delete the record from the database
    await Record.findByIdAndDelete(id);

    res.status(200).json({ message: "Record deleted successfully." });
  } catch (e) {
    console.error("Error deleting record:", e);
    res.status(500).json({ message: "An error occurred while deleting the record." });
  }
};

const sendOneRecord = async (req, res) => {
  // Expect email, record, and sender details in the request body
  const { id } = req.params;
  const { contacts } = req.body;
  try {
    // Call the utility function to send the email
    const record = await Record.findById(id);
    const sender = req.user;
    for (let item of contacts) {
      await sendRecordEmail(item.email, record, sender);
    }

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email.", error: error.message });
  }
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  const { filePath } = req.body; // Ensure filePath contains the S3 object key

  try {
    // Find the record in the database
    const record = await Record.findById(id);

    // Check if the image exists in the record
    const imageIndex = record.image.findIndex((img) => img.filePath === filePath);
    if (imageIndex === -1) {
      console.log(filePath)
      return res.status(404).json({ message: "Image not found." });
    }

    // Remove the image from the database
    record.image.splice(imageIndex, 1);
    await record.save();

    // Delete the image from S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME, // Replace with your S3 bucket name
      Key: filePath, // Ensure filePath contains the S3 object key
    };
    await s3.send(new DeleteObjectCommand(params));

    res.status(200).json({ message: "Image deleted successfully from S3." });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Failed to delete image.", error: err.message });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { date, doctor, diagnosis, notes, isScript } = req.body;

  try {
    // Step 1: Find the current record
    const Curr_record = await Record.findById(id);
    if (!Curr_record) {
      return res.status(404).json({ message: "Record not found." });
    }

    // Step 2: Handle new image uploads
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => ({
        filename: file.originalname,
        filePath: file.location,
      }));

      Curr_record.image = Curr_record.image || [];
      Curr_record.image.push(...uploadedImages);
    }

    // Step 3: If isScript is truthy, run OCR and diagnosis
    if (isScript) {
      const imgToText = async (files) => {
        const worker = await createWorker("eng+hin");

        const textResults = await Promise.all(
          files.map(async ({ filePath }) => {
            const {
              data: { text },
            } = await worker.recognize(filePath);
            return text;
          })
        );

        await worker.terminate();
        return textResults;
      };

      const texts = uploadedImages.length > 0 ? await imgToText(uploadedImages) : [];
      Curr_record.script = await diagnosisResponses(texts);
      console.log(Curr_record.script)
    }

    // Step 4: Update fields (only if values are provided)
    if (date) Curr_record.date = date;
    if (doctor) Curr_record.doctor = doctor;
    if (diagnosis) Curr_record.diagnosis = diagnosis;
    if (notes) Curr_record.notes = notes;

    // Step 5: Save the updated record
    await Curr_record.save();

    res.status(200).json({ message: "Record updated successfully", record: Curr_record });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ message: "Failed to update record", error: err.message });
  }
};


const sendRecords = async (req, res) => {
  const { filteredRecords, send } = req.body;

  try {
    const sender = req.user;
    for (let item of send) {
      await sendRecordsEmail(item.email, filteredRecords, sender);
    }
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email.", error: error.message });
  }
};

module.exports = {
  sendRecords,
  updateRecord,
  deleteImage,
  sendOneRecord,
  deleteRecord,
  fetchOneRecord,
  fetchRecord,
  addRecord,
};
