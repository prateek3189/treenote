const db = require("./data/database");
const session = require("express-session");
const path = require("path");
const defaultRoutes = require("./routes/default.route");
const contactRoutes = require("./routes/contact.route");
const categoryRoutes = require("./routes/category.route");
const sessionConfig = require("./config/session");
const express = require("express");
const authMiddleware = require("./middleware/auth-middleware");
const cookieParser = require("cookie-parser");

const mongoDbSessionStore = sessionConfig.createSessionStore(session);
const app = express();

app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));

app.use(authMiddleware);

app.use("/", defaultRoutes);
app.use("/contacts", contactRoutes);
app.use("/categories", categoryRoutes);

app.use(function (req, res) {
  res.status(404).render("404");
});

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

db.connectToDatabse().then(() => {
  app.listen(3001);
  console.log("Running on http://localhost:3001");
});
