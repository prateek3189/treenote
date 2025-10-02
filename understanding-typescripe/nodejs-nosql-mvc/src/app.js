"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var session = require("express-session");
var path = require("path");
var database_1 = require("./data/database");
var default_route_1 = require("./routes/default.route");
var contact_route_1 = require("./routes/contact.route");
var category_route_1 = require("./routes/category.route");
var session_1 = require("./config/session");
var auth_middleware_1 = require("./middleware/auth-middleware");
var app = express.default();
var mongoDbSessionStore = (0, session_1.createSessionStore)(session.default);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.default.static(path.join(__dirname, "public")));
app.use("/uploads", express.default.static(path.join(__dirname, "uploads")));
app.use(express.default.urlencoded({ extended: false }));
app.use(session.default((0, session_1.createSessionConfig)(mongoDbSessionStore)));
app.use(auth_middleware_1.default);
app.use("/", default_route_1.default);
app.use("/contacts", contact_route_1.default);
app.use("/categories", category_route_1.default);
app.use(function (req, res) {
    res.status(404).render("404");
});
app.use(function (error, req, res, next) {
    res.status(500).render("500");
});
(0, database_1.connectToDatabse)().then(function () {
    app.listen(3001);
    console.log("Running on http://localhost:3001");
});
