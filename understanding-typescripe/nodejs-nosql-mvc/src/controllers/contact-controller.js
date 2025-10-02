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
exports.contactHome = contactHome;
exports.addContactHome = addContactHome;
exports.addContactController = addContactController;
exports.editContactPage = editContactPage;
exports.updateContactController = updateContactController;
exports.deleteContactController = deleteContactController;
var category_model_1 = require("../models/category.model");
var contact_model_1 = require("../models/contact.model");
function contactHome(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var data, contacts, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (!req.session.user) {
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    data = req.session.additionalInfo;
                    if (!data) {
                        data = {
                            message: "",
                            type: "info",
                        };
                    }
                    return [4 /*yield*/, contact_model_1.Contact.getAll()];
                case 2:
                    contacts = _a.sent();
                    res.render("contacts", {
                        contacts: contacts,
                        message: data.message,
                        type: data.type,
                    });
                    req.session.additionalInfo = null;
                    return [2 /*return*/];
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addContactHome(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (!req.session.user) {
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, category_model_1.Category.getAll()];
                case 1:
                    categories = _a.sent();
                    res.render("add-contact", { categories: categories });
                    return [2 /*return*/];
            }
        });
    });
}
function addContactController(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var contact;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Check Authentication
                    if (!req.session.user) {
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    contact = new contact_model_1.Contact(req.body.name, req.body.phone, req.body.category, ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "");
                    return [4 /*yield*/, contact.save()];
                case 1:
                    _b.sent();
                    req.session.additionalInfo = {
                        message: "Contact created successfully.",
                        type: "success",
                    };
                    res.redirect("/contacts");
                    return [2 /*return*/];
            }
        });
    });
}
function editContactPage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var categories, contact, contactData, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (!req.session.user) {
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, category_model_1.Category.getAll()];
                case 2:
                    categories = _a.sent();
                    contact = new contact_model_1.Contact("", "", "", "", req.params.id);
                    return [4 /*yield*/, contact.getContact()];
                case 3:
                    contactData = _a.sent();
                    res.render("edit-contact", { contact: contactData, categories: categories });
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateContactController(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var avatar, contact, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (!req.session.user) {
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    avatar = req.file;
                    contact = new contact_model_1.Contact(req.body.name, req.body.phone, req.body.category, avatar ? avatar.path : "", req.body.id);
                    return [4 /*yield*/, contact.update()];
                case 2:
                    _a.sent();
                    req.session.additionalInfo = {
                        message: "Contact updated successfully.",
                        type: "success",
                    };
                    res.redirect("/contacts");
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    console.log(e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteContactController(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var contact, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check Authentication
                    if (!req.session.user) {
                        res.redirect("/");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    contact = new contact_model_1.Contact("", "", "", "", req.body.id);
                    return [4 /*yield*/, contact.delete()];
                case 2:
                    _a.sent();
                    req.session.additionalInfo = {
                        message: "Contact deleted successfully.",
                        type: "success",
                    };
                    res.redirect("/contacts");
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    console.log(e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
