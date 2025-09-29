const { ObjectId } = require("bson");
const db = require("../data/database");

const express = require("express");
const router = express.Router();

// Contacts Page
router.get("/", async function (req, res) {
  try {
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

    res.render("contacts", { contacts: updatedContacts });
  } catch (e) {
    console.log(e);
  }
});

// Add Contacts page
router.get("/add", async function (req, res) {
  const categories = await db.getDb().collection("categories").find().toArray();
  res.render("add-contact", { categories });
});

// Add Contact page
router.post("/add", async function (req, res) {
  const contact = req.body;
  const newContact = {
    name: contact.name,
    phone: contact.phone,
    category: contact.category,
  };
  await db.getDb().collection("contacts").insertOne(newContact);
  res.redirect("/contacts");
});

// Update Contact page
router.post("/update", async function (req, res) {
  try {
    const contact = req.body;
    const contactId = new ObjectId(contact.id);
    const updateContact = {
      name: contact.name,
      phone: contact.phone,
      category: contact.category,
    };
    db.getDb()
      .collection("contacts")
      .updateOne({ _id: new ObjectId(contactId) }, { $set: updateContact });
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
});

// Edit Contact page
router.get("/edit/:id", async function (req, res) {
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

    res.render("edit-contact", { contact, categories });
  } catch (e) {
    console.log(e);
  }
});

// Delete Contact page
router.post("/delete", async function (req, res) {
  try {
    const id = new ObjectId(req.body.id);
    db.getDb().collection("contacts").deleteOne({ _id: id });
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
