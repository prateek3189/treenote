const express = require("express");
const upload = require("../utils/image-upload");
const {
  contactHome,
  addContactHome,
  addContactController,
  editContactPage,
  updateContactController,
  deleteContactController,
} = require("../controllers/contact-controller");

const router = express.Router();

// Contacts Page
router.get("/", contactHome);

// Add Contacts page
router.get("/add", addContactHome);

// Add Contact page
router.post("/add", upload.single("avatar"), addContactController);

// Edit Contact page
router.get("/edit/:id", editContactPage);

// Update Contact page
router.post("/update", upload.single("avatar"), updateContactController);

// Delete Contact page
router.post("/delete", deleteContactController);

module.exports = router;
