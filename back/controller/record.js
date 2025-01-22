const Record = require("../model/Record");
const Patient = require("../model/Patient");
const fs = require("fs").promises; // Use fs/promises for async/await operations
const path = require("path");
const sendRecordEmail = require("../utils/sendRecordEmail");
const sendRecordsEmail = require("../utils/sendRecordsEmail");

const addRecord = async (req, res) => {
  try {
    const { date, doctor, diagnosis, notes } = req.body;

    if (!date || !doctor) {
      return res
        .status(400)
        .json({ message: "Date and doctor are required fields." });
    }

    // Build the image objects
    const images = req.files.map((file) => ({
      filename: file.filename,
      filePath: `/uploads/${file.filename}`,
    }));
    if (req.user.isFirstTimeUser) {
      req.user.isFirstTimeUser = false;
      await req.user.save();
    }
    // Create the new record
    const newRecord = new Record({
      patient: req.user._id,
      date,
      doctor,
      diagnosis,
      notes,
      image: images,
    });

    const savedRecord = await newRecord.save();

    // Update the patient's list with the new record ID
    const patient = await Patient.findById(req.user._id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    patient.list.push(savedRecord._id);
    await patient.save();

    res.status(201).json({
      message: "Record added successfully.",
      record: savedRecord,
    });
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
      .populate({
        path: "list",
        options: { sort: { date: -1 } }, // Sort directly in the query
      })
      .populate({
        path: "contacts",
      })
      .populate({
        path: "hasPrimaryContact.primaryContact",
      });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Extract the sorted records
    const records = patient.list;

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
      return res.status(404).send("Record not found");
    }

    const patient = record.patient;
    const recordIndex = patient.list.indexOf(record._id);
    if (recordIndex > -1) {
      patient.list.splice(recordIndex, 1); // Remove the record ID from the list
      await patient.save(); // Save the patient document
      console.log(`Removed record ID ${id} from patient's list`);
    }
    // Iterate through images in the record
    for (let obj of record.image) {
      const filename = obj.filename;
      const fullPath = path.join(__dirname, "../", obj.filePath);
      console.log(`file path ${fullPath}`);
      try {
        // Check if the file exists before attempting to delete
        await fs.access(fullPath); // Check if file exists
        await fs.unlink(fullPath); // Delete the file
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err.message);
      }
    }

    // Delete the record from the database
    await Record.findByIdAndDelete(id);
    res.status(200).json({ message: `Record deleted.` });
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred while deleting the record.");
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
  const { filePath } = req.body; // Get filePath from the request body

  try {
    // Find the record
    const record = await Record.findById(id);

    // Check if the image exists in the record
    const imageIndex = record.image.findIndex(
      (img) => img.filePath === filePath
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Remove the image from the database (and possibly delete the file from the server)
    record.image.splice(imageIndex, 1);
    await record.save();

    // Optionally, delete the image file from the server (if using local storage)
    const filePathToDelete = path.join(__dirname, "../", filePath);
    fs.unlink(filePathToDelete); // Delete the file (adjust as necessary)

    res.status(200).json({ message: "Image deleted successfully." });
  } catch (err) {
    console.error("Error deleting image:", err);
    res
      .status(500)
      .json({ message: "Failed to delete image.", error: err.message });
  }
};

const updateRecord = async (req, res) => {
  let { id } = req.params; // Extract the record ID from URL
  let { date, doctor, diagnosis, notes } = req.body; // Extract the record data from the request body

  try {
    // Step 1: Find the current record by ID
    const Curr_record = await Record.findById(id);
    if (!Curr_record) {
      return res.status(404).json({ message: "Record not found." });
    }

    // Step 2: Handle file uploads
    if (req.files) {
      const images = req.files.map((file) => ({
        filename: file.filename,
        filePath: `/uploads/${file.filename}`,
      }));
      Curr_record.image.push(...images); // Add the new images to the existing ones
    }

    // Step 3: Update the fields with new data from the request body
    Curr_record.date = date || Curr_record.date;
    Curr_record.doctor = doctor || Curr_record.doctor;
    Curr_record.diagnosis = diagnosis || Curr_record.diagnosis;
    Curr_record.notes = notes || Curr_record.notes;

    // Step 4: Save the updated record
    await Curr_record.save();

    // Step 5: Send a success response
    res
      .status(200)
      .json({ message: "Record updated successfully", record: Curr_record });
  } catch (err) {
    console.error("Error updating record:", err);
    res
      .status(500)
      .json({ message: "Failed to update record", error: err.message });
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
