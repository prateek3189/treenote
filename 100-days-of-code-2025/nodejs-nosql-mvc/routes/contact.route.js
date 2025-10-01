const express = require("express");
const { ObjectId } = require("bson");
const db = require("../data/database");
const upload = require("../utils/image-upload");
const Contact = require("../models/contact.model");
const Category = require("../models/category.model");

const router = express.Router();

// Contacts Page
router.get("/", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    let data = req.session.additionalInfo;
    if (!data) {
      data = {
        message: "",
        type: "",
      };
    }

    const contacts = await Contact.getAll();
    res.render("contacts", {
      contacts,
      message: data.message,
      type: data.type,
    });
    req.session.additionalInfo = null;
    return;
  } catch (e) {
    console.log(e);
  }
});

// Add Contacts page
router.get("/add", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const categories = await Category.getAll();
  res.render("add-contact", { categories });
});

// Add Contact page
router.post("/add", upload.single("avatar"), async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  const contact = new Contact(
    req.body.name,
    req.body.phone,
    req.body.category,
    req.file.path
  );

  await contact.save();
  req.session.additionalInfo = {
    message: "Contact created successfully.",
    type: "success",
  };
  res.redirect("/contacts");
});

// Edit Contact page
router.get("/edit/:id", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    const categories = await Category.getAll();

    const contact = new Contact(null, null, null, null, req.params.id);
    const contactData = await contact.getContact();
    res.render("edit-contact", { contact: contactData, categories });
  } catch (e) {
    console.log(e);
  }
});

// Update Contact page
router.post("/update", upload.single("avatar"), async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    const avatar = req.file;
    const contact = new Contact(
      req.body.name,
      req.body.phone,
      req.body.category,
      avatar ? avatar.path : "",
      req.body.id
    );
    await contact.update();

    req.session.additionalInfo = {
      message: "Contact updated successfully.",
      type: "success",
    };
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
});

// Delete Contact page
router.post("/delete", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    const contact = new Contact(null, null, null, null, req.body.id);
    await contact.delete();
    req.session.additionalInfo = {
      message: "Contact deleted successfully.",
      type: "success",
    };
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
