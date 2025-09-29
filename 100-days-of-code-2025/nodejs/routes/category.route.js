const fs = require("fs");
const path = require("path");
const { getFileData } = require("../utils/contact-data");

const express = require("express");
const router = express.Router();

// Categories Page
router.get("/", async function (req, res) {
  const categories = await getFileData("categories.json");
  res.render("categories", { categories });
});

// Add Category page
router.get("/add", function (req, res) {
  res.render("add-category");
});

// Add Category page
router.post("/add", async function (req, res) {
  const category = req.body;
  const filePath = path.join(__dirname, "data", "categories.json");
  const categories = await getFileData("categories.json");
  categories.push({ id: new Date().getTime(), ...category });
  fs.writeFileSync(filePath, JSON.stringify(categories));
  res.redirect("/categories");
});

// Edit Category page
router.get("/edit/:id", async function (req, res) {
  const id = req.params.id;
  const categories = await getFileData("categories.json");
  const category = categories.find((c) => +c.id === +id);
  res.render("edit-category", { category });
});

module.exports = router;
