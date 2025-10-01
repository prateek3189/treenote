const Category = require("../models/category.model");
const Contact = require("../models/contact.model");

async function categoryHome(req, res) {
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
}

function addCategoryHome(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("add-category");
}

async function addCategoryController(req, res) {
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
}

async function editCategoryPage(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const category = new Category(null, req.params.id);
  const categoryData = await category.getCategory();
  res.render("edit-category", { category: categoryData });
}

async function updateCategoryController(req, res) {
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
}

async function deleteCategoryController(req, res) {
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
}

module.exports = {
  categoryHome,
  addCategoryHome,
  addCategoryController,
  editCategoryPage,
  updateCategoryController,
  deleteCategoryController,
};
