const fs = require("fs");
const path = require("path");
const defaultRoutes = require("./routes/default.route");
const contactRoutes = require("./routes/contact.route");
const categoryRoutes = require("./routes/category.route");

const express = require("express");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/", defaultRoutes);
app.use("/contacts", contactRoutes);
app.use("/categories", categoryRoutes);

app.use(function (req, res) {
  res.status(404).render("404");
});

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(3001);
console.log("Running on http://localhost:3001");
