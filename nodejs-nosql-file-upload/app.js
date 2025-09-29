const db = require("./data/database");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");
const path = require("path");
const defaultRoutes = require("./routes/default.route");
const contactRoutes = require("./routes/contact.route");
const categoryRoutes = require("./routes/category.route");
const csrf = require("csurf");

const express = require("express");
const MongoDBStore = mongodbStore(session);

const app = express();
const sessionStore = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017",
  databaseName: "treenote",
  collection: "sessions",
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "TREENOTE",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(csrf());

app.use(function (req, res, next) {
  const user = req.session.user;

  if (!user) {
    return next();
  }

  res.locals.isAdmin = user.user_type === "A";
  next();
});

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
