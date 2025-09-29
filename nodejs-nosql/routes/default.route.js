const db = require("../data/database");

const express = require("express");
const router = express.Router();

// Login page
router.get("/", function (req, res) {
  res.render("index");
});

// Register page
router.get("/register", function (req, res) {
  res.render("register");
});

// Register page
router.post("/register", async function (req, res) {
  try {
    const user = req.body;

    const newUser = {
      name: user.username,
      email: user.email,
      password: user.password,
    };
    await db.getDb().collection("users").insertOne(newUser);
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// Register page
router.post("/login", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ email: email, password: password });
    if (user) {
      res.redirect("/contacts");
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
