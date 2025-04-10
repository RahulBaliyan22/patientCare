const express = require("express");
const { isLoggedIn, validateContact,isPatient } = require("../middleware");
const {togglePrimary,updateOneContact,fetchOneContact,addContact,deleteContact,fetchContacts,queryMail} = require("../controller/contact")
const router = express.Router();

router.get("/contacts", isLoggedIn, isPatient,fetchContacts);

router.delete("/contact/delete/:id", isLoggedIn, isPatient,deleteContact);

router.post("/contact", isLoggedIn, validateContact,isPatient, addContact);

router.get("/contact/:id", isLoggedIn,isPatient, fetchOneContact);

router.put(
  "/contact/update/:id",
  isLoggedIn,
  validateContact,
  isPatient,
  updateOneContact
);

router.put("/contact/:id/toggle-primary", isLoggedIn,isPatient, togglePrimary);

router.post("/sendQuery",queryMail);

module.exports = router;
