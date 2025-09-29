const db = require("../data/database");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Login page
router.get("/", function (req, res) {
  // Check Authentication
  if (req.session.user) {
    res.redirect("/contacts");
    return;
  }
  const csrfToken = req.csrfToken();
  let data = req.session.addtionalInfo;
  if (!data) {
    data = {
      error: "",
      email: "",
      password: "",
    };
  }
  res.render("index", {
    error: data.error,
    email: data.email,
    password: data.password,
    csrfToken: csrfToken,
  });
  req.session.addtionalInfo = null;
});

// Register page
router.get("/register", function (req, res) {
  // Check Authentication
  if (req.session.user) {
    res.redirect("/contacts");
    return;
  }

  try {
    let data = req.session.addtionalInfo;
    if (!data) {
      data = {
        error: "",
        email: "",
        username: "",
        password: "",
        confirm_password: "",
      };
    }
    const csrfToken = req.csrfToken();

    res.render("register", {
      error: data.error,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      username: data.username,
      csrfToken: csrfToken,
    });
    req.session.addtionalInfo = null;
  } catch (e) {
    console.log(e);
  }
});

// Register page
router.post("/register", async function (req, res) {
  // Check Authentication
  if (req.session.user) {
    res.redirect("/contacts");
    return;
  }
  try {
    const user = req.body;
    const username = user.username;
    const email = user.email;
    const password = user.password;
    const confirm_password = user.confirm_password;

    // Check if passwords are same
    if (password !== confirm_password) {
      res.redirect("/register");
      return;
    }

    // Check if email is already exists
    const existingUser = await db
      .getDb()
      .collection("users")
      .findOne({ email: user.email });
    if (existingUser) {
      req.session.addtionalInfo = {
        error: "User already exists with the same email.",
        email: email,
        username: username,
        password: password,
        confirm_password: confirm_password,
      };
      req.session.save(() => {
        res.redirect("/register");
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      name: user.username,
      email: user.email,
      password: hashedPassword,
      user_type: "U",
    };
    await db.getDb().collection("users").insertOne(newUser);
    res.redirect("/");
    return;
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async function (req, res) {
  // Check Authentication
  if (req.session.user) {
    res.redirect("/contacts");
    return;
  }
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await db.getDb().collection("users").findOne({ email: email });
    if (!user) {
      req.session.addtionalInfo = {
        error: "User does not exists.",
        email: email,
        password: password,
      };
      res.redirect("/");
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      req.session.addtionalInfo = {
        error: "User entered wrong password.",
        email: email,
        password: password,
      };
      res.redirect("/");
      return;
    }

    // Add data to session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
      isAuthenticated: true,
    };
    req.session.save(() => {
      res.redirect("/contacts");
    });
  } catch (e) {
    console.log(e);
  }
});

// Register page
router.post("/logout", async function (req, res) {
  try {
    req.session.user = null;
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
