const { ObjectId } = require("bson");
const db = require("../data/database");
const { getFileData } = require("../utils/contact-data");

const express = require("express");
const router = express.Router();

// Categories Page
router.get("/", async function (req, res) {
  const categories = await db.getDb().collection("categories").find().toArray();
  res.render("categories", { categories });
});

// Add Category page
router.get("/add", function (req, res) {
  res.render("add-category");
});

// Add Category page
router.post("/add", async function (req, res) {
  const category = req.body.name;
  await db.getDb().collection("categories").insertOne({ name: category });
  res.redirect("/categories");
});

// Edit Category page
router.get("/edit/:id", async function (req, res) {
  const id = req.params.id;
  const category = await db
    .getDb()
    .collection("categories")
    .findOne({ _id: new ObjectId(id) });
  res.render("edit-category", { category });
});

// Update Category page
router.post("/update", async function (req, res) {
  const catId = new ObjectId(req.body.id);
  const category = req.body.name;
  db.getDb()
    .collection("categories")
    .updateOne({ _id: catId }, { $set: { name: category } });
  res.redirect("/categories");
});

// Delete Categories page
router.post("/delete", async function (req, res) {
  try {
    const id = new ObjectId(req.body.id);
    db.getDb().collection("categories").deleteOne({ _id: id });
    res.redirect("/categories");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
