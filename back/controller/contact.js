const crypto = require("crypto");
const sendContactVerification = require("../utils/sendContactVerification");
const Patient = require("../model/Patient");
const Contact = require("../model/Contact");

const fetchContacts = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id).populate("contacts");
    res
      .status(200)
      .json({ message: "all contacts", contacts: patient.contacts });
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    // Find the user and filter out the contact
    req.user.contacts = req.user.contacts.filter(
      (item) => item._id.toString() !== id
    );

    if(contact.isPrimary){
      req.user.hasPrimaryContact.isPrimary =false;
      req.user.hasPrimaryContact.primaryContact = null;
    }
    await contact.save();
    await req.user.save();

    res.status(200).json({ message: "Deleted Contact Successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error while deleting contact" });
  }
};

const addContact = async (req, res) => {
  const { name, phone, email, isPrimary } = req.body;

  try {
    // Generate a verification token for the contact
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new contact
    const contact = new Contact({
      name,
      phone,
      email,
      verificationToken,
    });

    const savedContact = await contact.save();

    // Add the contact to the patient's contacts array
    req.user.contacts.push(savedContact._id);

    await req.user.save();

    // Send verification email
    await sendContactVerification(
      { name, email },
      req.user,
      isPrimary,
      verificationToken
    );

    res.status(201).json({
      message:
        "Verification email sent. Please inform your contact to verify their email.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering contact", error: error.message });
  }
};

const fetchOneContact = async (req, res) => {
  let { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    res.status(200).json({ message: "Contact sent", contact });
  } catch (e) {
    res.status(500).json({ message: "Contact sent" });
  }
};

const updateOneContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    let emailChanged = false;

    if (email && email !== contact.email) {
      emailChanged = true;
      contact.isVerified = false;
      contact.verificationToken = crypto.randomBytes(32).toString("hex");
    }

    // Update contact details
    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;

    await contact.save();

    if (emailChanged) {
      await sendContactVerification(
        contact,
        req.user,
        req.user.hasPrimaryContact.isPrimary,
        contact.verificationToken
      );
      return res.status(201).json({
        message:
          "Verification email sent. Please inform your contact to verify their email.",
      });
    }

    res.status(200).json({ message: "Contact updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const togglePrimary = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    const patient = await Patient.findById(req.user).populate(
      "hasPrimaryContact.primaryContact"
    );
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const previousPrimaryContact = patient.hasPrimaryContact.primaryContact;

    // Check if the current contact is already the primary contact
    if (
      previousPrimaryContact &&
      previousPrimaryContact._id.toString() === id
    ) {
      return res
        .status(400)
        .json({
          message: "This contact is already set as the primary contact.",
        });
    }

    // If there is an existing primary contact, set it to non-primary
    if (previousPrimaryContact) {
      previousPrimaryContact.isPrimary = false;
      await previousPrimaryContact.save();
    }

    // Set the new contact as primary
    contact.isPrimary = true;
    await contact.save();

    // Update the patient object
    patient.hasPrimaryContact = {
      isPrimary: true,
      primaryContact: contact._id,
    };
    await patient.save();

    res.status(200).json({
      message: "Contact successfully set as primary.",
      contact,
    });
  } catch (error) {
    console.error("Error toggling primary contact:", error);
    res.status(500).json({
      message: "An error occurred while updating the primary contact.",
      error: error.message,
    });
  }
};

module.exports = {
  togglePrimary,
  updateOneContact,
  fetchOneContact,
  addContact,
  deleteContact,
  fetchContacts,
};
