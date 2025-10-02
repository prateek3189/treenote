import * as express from "express";
import { upload } from "../utils/image-upload";
import {
  contactHome,
  addContactHome,
  addContactController,
  editContactPage,
  updateContactController,
  deleteContactController,
} from "../controllers/contact-controller";

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

export default router;
