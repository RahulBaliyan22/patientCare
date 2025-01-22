const express = require("express");
const { isLoggedIn, validateContact } = require("../middleware");
const {togglePrimary,updateOneContact,fetchOneContact,addContact,deleteContact,fetchContacts} = require("../controller/contact")
const router = express.Router();

router.get("/contacts", isLoggedIn, fetchContacts);

router.delete("/contact/delete/:id", isLoggedIn, deleteContact);

router.post("/contact", isLoggedIn, validateContact, addContact);

router.get("/contact/:id", isLoggedIn, fetchOneContact);

router.put(
  "/contact/update/:id",
  isLoggedIn,
  validateContact,
  updateOneContact
);

router.put("/contact/:id/toggle-primary", isLoggedIn, togglePrimary);

module.exports = router;
