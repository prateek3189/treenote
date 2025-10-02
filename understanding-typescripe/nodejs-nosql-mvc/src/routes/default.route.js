"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bcryptjs_1 = require("bcryptjs");
var xss_1 = require("xss");
var user_model_1 = require("../models/user.model");
var router = express_1.default.Router();
// Login page
router.get("/", function (req, res) {
    // Check Authentication
    if (req.session.user) {
        res.redirect("/contacts");
        return;
    }
    var data = req.session.addtionalInfo;
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
        var data = req.session.addtionalInfo;
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
router.post("/register", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var user, username, email, password, confirm_password, hashedPassword, userModel, existingUser, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (req.session.user) {
                        res.redirect("/contacts");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    user = req.body;
                    username = (0, xss_1.default)(user.username);
                    email = (0, xss_1.default)(user.email);
                    password = (0, xss_1.default)(user.password);
                    confirm_password = (0, xss_1.default)(user.confirm_password);
                    return [4 /*yield*/, bcryptjs_1.default.hash(password, 12)];
                case 2:
                    hashedPassword = _a.sent();
                    // Check if passwords are same
                    if (password !== confirm_password) {
                        res.redirect("/register");
                        return [2 /*return*/];
                    }
                    userModel = new user_model_1.User(user.username, user.email, hashedPassword, "U");
                    return [4 /*yield*/, userModel.searchUser({ email: user.email })];
                case 3:
                    existingUser = _a.sent();
                    if (existingUser) {
                        req.session.addtionalInfo = {
                            error: "User already exists with the same email.",
                            email: email,
                            username: username,
                            password: password,
                            confirm_password: confirm_password,
                        };
                        req.session.save(function () {
                            res.redirect("/register");
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, userModel.create()];
                case 4:
                    _a.sent();
                    res.redirect("/");
                    return [2 /*return*/];
                case 5:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
router.post("/login", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, userModel, user, valid, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (req.session.user) {
                        res.redirect("/contacts");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    email = (0, xss_1.default)(req.body.email);
                    password = (0, xss_1.default)(req.body.password);
                    userModel = new user_model_1.User("", email, password);
                    return [4 /*yield*/, userModel.searchUser({ email: email })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        req.session.addtionalInfo = {
                            error: "User does not exists.",
                            email: email,
                            password: password,
                        };
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                case 3:
                    valid = _a.sent();
                    if (!valid) {
                        req.session.addtionalInfo = {
                            error: "User entered wrong password.",
                            email: email,
                            password: password,
                        };
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    // Add data to session
                    req.session.user = {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        user_type: user.user_type,
                        isAuthenticated: true,
                    };
                    req.session.save(function () {
                        res.redirect("/contacts");
                    });
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
// Register page
router.post("/logout", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                req.session.user = null;
                req.session.save(function () {
                    res.redirect("/");
                });
            }
            catch (e) {
                console.log(e);
            }
            return [2 /*return*/];
        });
    });
});
exports.default = router;
