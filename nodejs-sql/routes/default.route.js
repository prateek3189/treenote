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
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [user.username, user.email, user.password]
    );
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
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ? ",
      [email, password]
    );
    if (users.length > 0) {
      res.redirect("/contacts");
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
