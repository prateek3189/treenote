const fs = require("fs");
const path = require("path");
const { getFileData } = require("../utils/contact-data");

const express = require("express");
const router = express.Router();

// Contacts Page
router.get("/", async function (req, res) {
  try {
    const contacts = await getFileData("contacts.json");
    const categories = await getFileData("categories.json");

    const updatedContacts = contacts.map((c) => {
      const category = categories.find((cat) => {
        return +cat.id === +c.category;
      });
      const contact = { ...c, categoryName: category.name };
      return contact;
    });
    res.render("contacts", { contacts: updatedContacts });
  } catch (e) {
    console.log(e);
  }
});

// Add Contacts page
router.get("/add", async function (req, res) {
  const categories = await getFileData("categories.json");
  res.render("add-contact", { categories });
});

// Add Contact page
router.post("/add", async function (req, res) {
  const contact = req.body;
  const contacts = await getFileData("contacts.json");
  const filePath = path.join(__dirname, "data", "contacts.json");
  contacts.push({ id: new Date().getTime(), ...contact });
  fs.writeFileSync(filePath, JSON.stringify(contacts));
  res.redirect("/contacts");
});

// Edit Contact page
router.get("/edit/:id", async function (req, res) {
  const id = req.params.id;
  const contacts = await getFileData("contacts.json");
  const contact = contacts.find((c) => +c.id === +id);
  const categories = await getFileData("categories.json");
  res.render("edit-contact", { contact, categories });
});

module.exports = router;
