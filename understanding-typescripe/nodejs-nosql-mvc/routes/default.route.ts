import { getDb } from "../data/database";
import * as express from "express";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { MessageType, UserType } from "../types";
import xss from "xss";
const router = express.Router();

// Login page
router.get("/", function (req: Request, res: Response) {
  // Check Authentication
  if ((req.session as any).user) {
    res.redirect("/contacts");
    return;
  }
  let data = (req.session as any).addtionalInfo;
  if (!data) {
    data = {
      error: "",
      email: "",
      password: "",
      message: "",
      type: "info" as MessageType,
    };
  }
  res.render("index", {
    error: data.error,
    email: data.email,
    password: data.password,
  });
  (req.session as any).addtionalInfo = null;
});

// Register page
router.get("/register", function (req: Request, res: Response) {
  // Check Authentication
  if ((req.session as any).user) {
    res.redirect("/contacts");
    return;
  }

  try {
    let data = (req.session as any).addtionalInfo;
    if (!data) {
      data = {
        error: "",
        email: "",
        username: "",
        password: "",
        confirm_password: "",
      };
    }

    res.render("register", {
      error: data.error,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      username: data.username,
    });
    (req.session as any).addtionalInfo = null;
  } catch (e) {
    console.log(e);
  }
});

// Register page
router.post("/register", async function (req: Request, res: Response) {
  // Check Authentication
  if ((req.session as any).user) {
    res.redirect("/contacts");
    return;
  }
  try {
    const user = req.body;
    const username = xss(user.username);
    const email = xss(user.email);
    const password = xss(user.password);
    const confirm_password = xss(user.confirm_password);

    // Check if passwords are same
    if (password !== confirm_password) {
      res.redirect("/register");
      return;
    }

    // Check if email is already exists
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    const existingUser = await db
      .collection("users")
      .findOne({ email: user.email });
    if (existingUser) {
      (req.session as any).addtionalInfo = {
        error: "User already exists with the same email.",
        email: email,
        username: username,
        password: password,
        confirm_password: confirm_password,
      };
      (req.session as any).save(() => {
        res.redirect("/register");
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      name: user.username,
      email: user.email,
      password: hashedPassword,
      user_type: "U" as UserType,
    };
    const db2 = getDb();
    if ("message" in db2) {
      throw new Error(db2.message);
    }
    await db2.collection("users").insertOne(newUser);
    res.redirect("/");
    return;
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async function (req: Request, res: Response) {
  // Check Authentication
  if ((req.session as any).user) {
    res.redirect("/contacts");
    return;
  }
  try {
    const email = xss(req.body.email);
    const password = xss(req.body.password);
    const db3 = getDb();
    if ("message" in db3) {
      throw new Error(db3.message);
    }
    const user = await db3.collection("users").findOne({ email: email });
    if (!user) {
      (req.session as any).addtionalInfo = {
        error: "User does not exists.",
        email: email,
        password: password,
      };
      res.redirect("/");
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      (req.session as any).addtionalInfo = {
        error: "User entered wrong password.",
        email: email,
        password: password,
      };
      res.redirect("/");
      return;
    }

    // Add data to session
    (req.session as any).user = {
      id: user._id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
      isAuthenticated: true,
    };
    (req.session as any).save(() => {
      res.redirect("/contacts");
    });
  } catch (e) {
    console.log(e);
  }
});

// Register page
router.post("/logout", async function (req: Request, res: Response) {
  try {
    (req.session as any).user = null;
    (req.session as any).save(() => {
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
});

export default router;
