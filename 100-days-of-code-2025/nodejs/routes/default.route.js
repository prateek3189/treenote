const fs = require("fs");
const path = require("path");
const { getFileData } = require("../utils/contact-data");

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
    const filePath = path.join(__dirname, "data", "users.json");

    const users = await getFileData("users.json");
    users.push({ id: new Date().getTime(), ...user });
    fs.writeFileSync(filePath, JSON.stringify(users));
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// Register page
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const users = await getFileData("users.json");

  const user = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );
  if (user) {
    // sessionStorage.setItem("error", "");
    // localStorage.setItem("user", user);
    res.redirect("/contacts");
  } else {
    // sessionStorage.setItem("error", "Invalid Username or Password");
    res.redirect("/");
  }
});

module.exports = router;
