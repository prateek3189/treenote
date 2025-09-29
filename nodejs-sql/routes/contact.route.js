const db = require("../data/database");

const express = require("express");
const router = express.Router();

// Contacts Page
router.get("/", async function (req, res) {
  try {
    const [contacts] = await db.query(
      "SELECT *, contacts.name as contact_name, contacts.id as contact_id,  categories.name as category_name FROM contacts INNER JOIN categories ON categories.id = contacts.category"
    );

    res.render("contacts", { contacts });
  } catch (e) {
    console.log(e);
  }
});

// Add Contacts page
router.get("/add", async function (req, res) {
  const [categories] = await db.query("SELECT * FROM categories");
  res.render("add-contact", { categories });
});

// Add Contact page
router.post("/add", async function (req, res) {
  const contact = req.body;
  await db.query(
    "INSERT INTO contacts (name, phone, category) VALUES (?, ?, ?)",
    [contact.name, contact.phone, contact.category]
  );

  res.redirect("/contacts");
});

// Update Contact page
router.post("/update", async function (req, res) {
  const contact = req.body;
  try {
    await db.query(
      "UPDATE contacts SET name = ?, phone = ?, category = ? WHERE id = ?",
      [contact.name, contact.phone, contact.category, contact.id]
    );

    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
});

// Edit Contact page
router.get("/edit/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const [categories] = await db.query("SELECT * FROM categories");
    const [contact] = await db.query("SELECT * FROM contacts WHERE id = ?", [
      id,
    ]);
    res.render("edit-contact", { contact: contact[0], categories });
  } catch (e) {
    console.log(e);
  }
});

// Delete Contact page
router.post("/delete", async function (req, res) {
  try {
    const id = req.body.id;
    await db.query("DELETE FROM contacts WHERE id = ? ", [id]);
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
