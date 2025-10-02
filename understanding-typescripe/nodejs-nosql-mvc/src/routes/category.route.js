"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var category_controller_1 = require("../controllers/category-controller");
var router = express.Router();
// Categories Page
router.get("/", category_controller_1.categoryHome);
// Add Category page
router.get("/add", category_controller_1.addCategoryHome);
// Add Category page
router.post("/add", category_controller_1.addCategoryController);
// Edit Category page
router.get("/edit/:id", category_controller_1.editCategoryPage);
// Update Category page
router.post("/update", category_controller_1.updateCategoryController);
// Delete Categories page
router.post("/delete", category_controller_1.deleteCategoryController);
exports.default = router;
