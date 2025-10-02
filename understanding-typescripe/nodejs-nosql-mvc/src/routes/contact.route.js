"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var image_upload_1 = require("../utils/image-upload");
var contact_controller_1 = require("../controllers/contact-controller");
var router = express.Router();
// Contacts Page
router.get("/", contact_controller_1.contactHome);
// Add Contacts page
router.get("/add", contact_controller_1.addContactHome);
// Add Contact page
router.post("/add", image_upload_1.upload.single("avatar"), contact_controller_1.addContactController);
// Edit Contact page
router.get("/edit/:id", contact_controller_1.editContactPage);
// Update Contact page
router.post("/update", image_upload_1.upload.single("avatar"), contact_controller_1.updateContactController);
// Delete Contact page
router.post("/delete", contact_controller_1.deleteContactController);
exports.default = router;
