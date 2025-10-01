const { ObjectId } = require("bson");
const db = require("../data/database");
const xss = require("xss");

const express = require("express");
const Category = require("../models/category.model");
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
  const categories = await Category.getAll();

  res.render("categories", {
    categories,
    message: data.message,
    type: data.type,
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

  res.render("add-category");
});

// Add Category page
router.post("/add", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const category = new Category(req.body.name);
  await category.save();
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
  const category = new Category(null, req.params.id);
  const categoryData = await category.getCategory();
  res.render("edit-category", { category: categoryData });
});

// Update Category page
router.post("/update", async function (req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  const category = new Category(req.body.name, req.body.id);
  await category.update();

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
    const category = new Category(null, req.body.id);
    category.delete();
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
