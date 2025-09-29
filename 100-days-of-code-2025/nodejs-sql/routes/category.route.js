const fs = require("fs");
const path = require("path");
const db = require("../data/database");
const { getFileData } = require("../utils/contact-data");

const express = require("express");
const router = express.Router();

// Categories Page
router.get("/", async function (req, res) {
  const [categories] = await db.query("SELECT * FROM categories");
  res.render("categories", { categories });
});

// Add Category page
router.get("/add", function (req, res) {
  res.render("add-category");
});

// Add Category page
router.post("/add", async function (req, res) {
  const category = req.body.name;
  await db.query("INSERT INTO categories (name) VALUES (?)", [category]);
  res.redirect("/categories");
});

// Update Category page
router.post("/update", async function (req, res) {
  const category = req.body;
  console.log(category);
  await db.query("UPDATE categories SET name = ? WHERE id = ? ", [
    category.name,
    category.id,
  ]);
  res.redirect("/categories");
});

// Edit Category page
router.get("/edit/:id", async function (req, res) {
  const id = req.params.id;
  const [categories] = await db.query("SELECT * FROM categories WHERE id = ?", [
    id,
  ]);
  res.render("edit-category", { category: categories[0] });
});

// Delete Categories page
router.post("/delete", async function (req, res) {
  try {
    const id = req.body.id;
    await db.query("DELETE FROM categories WHERE id = ? ", [id]);
    res.redirect("/categories");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
