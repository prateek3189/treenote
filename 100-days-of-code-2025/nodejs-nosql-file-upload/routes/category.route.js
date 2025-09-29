const { ObjectId } = require("bson");
const db = require("../data/database");

const express = require("express");
const router = express.Router();

// Categories Page
router.get("/", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  let data = req.session.additionalInfo;
  if (!data) {
    data = {
      message: "",
      type: "",
    };
  }
  const categories = await db.getDb().collection("categories").find().toArray();
  const csrfToken = req.csrfToken();

  res.render("categories", {
    categories,
    message: data.message,
    type: data.type,
    csrfToken,
  });
  req.session.additionalInfo = null;
  return;
});

// Add Category page
router.get("/add", function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const csrfToken = req.csrfToken();

  res.render("add-category", { csrfToken });
});

// Add Category page
router.post("/add", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const category = req.body.name;
  await db.getDb().collection("categories").insertOne({ name: category });
  req.session.additionalInfo = {
    message: "Category created successfully.",
    type: "success",
  };
  res.redirect("/categories");
});

// Edit Category page
router.get("/edit/:id", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const id = req.params.id;
  const category = await db
    .getDb()
    .collection("categories")
    .findOne({ _id: new ObjectId(id) });
  const csrfToken = req.csrfToken();

  res.render("edit-category", { category, csrfToken });
});

// Update Category page
router.post("/update", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const catId = new ObjectId(req.body.id);
  const category = req.body.name;
  db.getDb()
    .collection("categories")
    .updateOne({ _id: catId }, { $set: { name: category } });
  req.session.additionalInfo = {
    message: "Category updated successfully.",
    type: "success",
  };
  res.redirect("/categories");
});

// Delete Categories page
router.post("/delete", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    const id = new ObjectId(req.body.id);
    db.getDb().collection("categories").deleteOne({ _id: id });
    req.session.additionalInfo = {
      message: "Category deleted successfully.",
      type: "success",
    };
    res.redirect("/categories");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
