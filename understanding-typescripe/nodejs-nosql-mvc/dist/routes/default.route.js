"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../data/database");
const express = __importStar(require("express"));
const bcrypt = __importStar(require("bcryptjs"));
const xss_1 = __importDefault(require("xss"));
const router = express.Router();
// Login page
router.get("/", function (req, res) {
    // Check Authentication
    if (req.session.user) {
        res.redirect("/contacts");
        return;
    }
    let data = req.session.addtionalInfo;
    if (!data) {
        data = {
            error: "",
            email: "",
            password: "",
            message: "",
            type: "info",
        };
    }
    res.render("index", {
        error: data.error,
        email: data.email,
        password: data.password,
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
        res.render("register", {
            error: data.error,
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
            username: data.username,
        });
        req.session.addtionalInfo = null;
    }
    catch (e) {
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
        const username = (0, xss_1.default)(user.username);
        const email = (0, xss_1.default)(user.email);
        const password = (0, xss_1.default)(user.password);
        const confirm_password = (0, xss_1.default)(user.confirm_password);
        // Check if passwords are same
        if (password !== confirm_password) {
            res.redirect("/register");
            return;
        }
        // Check if email is already exists
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const existingUser = await db
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
        const db2 = (0, database_1.getDb)();
        if ("message" in db2) {
            throw new Error(db2.message);
        }
        await db2.collection("users").insertOne(newUser);
        res.redirect("/");
        return;
    }
    catch (e) {
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
        const email = (0, xss_1.default)(req.body.email);
        const password = (0, xss_1.default)(req.body.password);
        const db3 = (0, database_1.getDb)();
        if ("message" in db3) {
            throw new Error(db3.message);
        }
        const user = await db3.collection("users").findOne({ email: email });
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
    }
    catch (e) {
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
    }
    catch (e) {
        console.log(e);
    }
});
exports.default = router;
//# sourceMappingURL=default.route.js.map