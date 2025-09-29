const express = require("express");
const { ObjectId } = require("bson");
const db = require("../data/database");
const upload = require("../utils/image-upload");
const xss = require("xss");

const router = express.Router();

// Contacts Page
router.get("/", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const csrfToken = req.csrfToken();
  try {
    let data = req.session.additionalInfo;
    if (!data) {
      data = {
        message: "",
        type: "",
      };
    }
    const contacts = await db.getDb().collection("contacts").find().toArray();
    const categories = await db
      .getDb()
      .collection("categories")
      .find()
      .toArray();
    const updatedContacts = contacts.map((c) => {
      const category = categories.find((cat) => {
        return cat._id.toString() === c.category.toString();
      });

      const contact = {
        ...c,
        categoryName: category ? category.name : "Category Deleted",
      };
      return contact;
    });

    res.render("contacts", {
      contacts: updatedContacts,
      message: data.message,
      type: data.type,
      csrfToken: csrfToken,
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
  const csrfToken = req.csrfToken();
  const categories = await db.getDb().collection("categories").find().toArray();
  res.render("add-contact", { categories, csrfToken });
});

// Add Contact page
router.post("/add", upload.single("avatar"), async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const contact = req.body;
  const avatar = req.file;

  const newContact = {
    name: xss(contact.name),
    phone: xss(contact.phone),
    category: xss(contact.category),
    avatar: avatar.path,
  };
  await db.getDb().collection("contacts").insertOne(newContact);
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
    const id = req.params.id;
    const categories = await db
      .getDb()
      .collection("categories")
      .find()
      .toArray();

    const contact = await db
      .getDb()
      .collection("contacts")
      .findOne({ _id: new ObjectId(id) });
    const csrfToken = req.csrfToken();
    res.render("edit-contact", { contact, categories, csrfToken });
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
    const contact = req.body;
    const avatar = req.file;
    const contactId = new ObjectId(contact.id);
    const updateContact = {
      name: xss(contact.name),
      phone: xss(contact.phone),
      category: xss(contact.category),
    };
    if (avatar) {
      updateContact.avatar = avatar.path;
    }
    db.getDb()
      .collection("contacts")
      .updateOne({ _id: new ObjectId(contactId) }, { $set: updateContact });
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
    const id = new ObjectId(req.body.id);
    db.getDb().collection("contacts").deleteOne({ _id: id });
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
