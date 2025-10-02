"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryHome = categoryHome;
exports.addCategoryHome = addCategoryHome;
exports.addCategoryController = addCategoryController;
exports.editCategoryPage = editCategoryPage;
exports.updateCategoryController = updateCategoryController;
exports.deleteCategoryController = deleteCategoryController;
const category_model_1 = require("../models/category.model");
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
            type: "info",
        };
    }
    const categories = await category_model_1.Category.getAll();
    res.render("categories", {
        categories,
        message: data.message,
        type: data.type,
    });
    req.session.additionalInfo = null;
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
    const category = new category_model_1.Category(req.body.name);
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
    const category = new category_model_1.Category("", req.params.id);
    const categoryData = await category.getCategory();
    res.render("edit-category", { category: categoryData });
}
async function updateCategoryController(req, res) {
    // Check Authentication
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    const category = new category_model_1.Category(req.body.name, req.body.id);
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
        const category = new category_model_1.Category("", req.body.id);
        await category.delete();
        req.session.additionalInfo = {
            message: "Category deleted successfully.",
            type: "success",
        };
        res.redirect("/categories");
    }
    catch (e) {
        console.log(e);
    }
}
//# sourceMappingURL=category-controller.js.map