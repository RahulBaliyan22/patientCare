const Medication = require("../model/Medication");

const Patient = require("../model/Patient");

const fetchMed = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id).populate("med");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.med.forEach((item) => {
      if (item.end) {
        const checkDate = new Date(item.end);
        const present = new Date();
        item.isEnd = present >= checkDate;
      }
    });

    await patient.save();

    res
      .status(200)
      .json({ message: "Successfully fetched medications", med: patient.med });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred" });
  }
};

const addMed = async (req, res) => {
  try {
    const { name, start, end, prescribedBy, dosage } = req.body;
    const patient = req.user;
    // Basic validation
    if (!name || !start) {
      return res
        .status(400)
        .json({
          message: "Please provide required fields: 'name' and 'start'.",
        });
    }

    // Construct medication object
    const med = new Medication({
      name,
      start,
      end: end || null,
      prescribedBy,
      dosage,
    });
    if (end) {
      const checkDate = new Date(end);
      const present = new Date();

      if (present >= checkDate) {
        med.isEnd = true;
      } else {
        med.isEnd = false;
      }
    }
    // Save to database
    const savedMed = await med.save();
    patient.med.push(savedMed);
    await patient.save();
    // Success response
    return res.status(201).json({
      message: "Medication entry created successfully.",
      medication: savedMed,
    });
  } catch (error) {
    console.error("Error creating medication entry:", error);

    // Error response
    return res.status(500).json({
      message: "An error occurred while creating the medication entry.",
      error: error.message,
    });
  }
};

const fetchOneMed = async (req, res) => {
  let { id } = req.params;
  try {
    const med = await Medication.findById(id);
    return res.status(200).json({
      message: "Medication Edit.",
      medication: med,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Error fetching Medication",
    });
  }
};

const updateMedEnd = async (req, res) => {
  let { id } = req.params;
  try {
    // Attempt to find the medication by ID and update the 'end' field and 'isEnd' field
    const med = await Medication.findByIdAndUpdate(
      id, // Medication ID
      {
        end: new Date(), // Set 'end' to the current date
        isEnd: true, // Mark 'isEnd' as true
      },
      { new: true } // Ensure the updated document is returned
    );

    if (!med) {
      return res.status(404).json({ message: "Medication not found" });
    }

    // Respond with the updated medication data
    res.status(200).json({
      message: "Medication end date and status updated successfully",
      updatedMedication: med,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating medication" });
  }
};

const deleteMed = async (req, res) => {
  const { id } = req.params; // Extract the medication ID from params

  try {
    // Find the patient by their ID and populate their medications
    const patient = await Patient.findById(req.user._id).populate("med");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Check if the medication exists in the patient's list
    const medicationExists = patient.med.some((m) => m._id.toString() === id);
    if (!medicationExists) {
      return res
        .status(404)
        .json({ message: "Medication not found in the patient record." });
    }

    // Filter out the medication to remove it
    patient.med = patient.med.filter((m) => m._id.toString() !== id);

    // Delete the medication document from the database
    await Medication.findByIdAndDelete(id);

    // Save the updated patient record
    await patient.save();

    // Respond with success
    res.status(200).json({ message: "Medication successfully deleted." });
  } catch (error) {
    console.error(error); // Log the error for debugging

    // Send an error response
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the medication.",
        error,
      });
  }
};

const updateOneMed = async (req, res) => {
  const { id } = req.params;
  const { start, end, name, prescribedBy, dosage } = req.body;

  try {
    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }
    if (start) medication.start = start;
    if (end) {
      medication.end = end;
    } else {
      medication.end = null;
    }
    if (name) medication.name = name;
    if (prescribedBy) medication.prescribedBy = prescribedBy;
    if (dosage) medication.dosage = dosage;
    if (end) {
      medication.isEnd = true;
    } else {
      medication.isEnd = false;
    }

    await medication.save();

    res.status(200).json({
      message: "Medication updated successfully.",
      medication,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An error occurred while updating the medication.",
      error,
    });
  }
};

module.exports = {
  updateOneMed,
  deleteMed,
  updateMedEnd,
  fetchOneMed,
  addMed,
  fetchMed,
};
