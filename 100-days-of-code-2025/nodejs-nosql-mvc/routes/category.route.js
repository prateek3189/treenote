const express = require("express");
const {
  categoryHome,
  addCategoryHome,
  addCategoryController,
  editCategoryPage,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category-controller");
const router = express.Router();

// Categories Page
router.get("/", categoryHome);

// Add Category page
router.get("/add", addCategoryHome);

// Add Category page
router.post("/add", addCategoryController);

// Edit Category page
router.get("/edit/:id", editCategoryPage);

// Update Category page
router.post("/update", updateCategoryController);

// Delete Categories page
router.post("/delete", deleteCategoryController);

module.exports = router;
