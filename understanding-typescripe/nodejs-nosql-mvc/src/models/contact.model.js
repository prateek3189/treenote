"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Contact = void 0;
var mongodb_1 = require("mongodb");
var database_1 = require("../data/database");
var xss_1 = require("xss");
var Contact = /** @class */ (function () {
    function Contact(name, phone, category, avatar, id) {
        this.name = (0, xss_1.default)(name);
        this.phone = (0, xss_1.default)(phone);
        this.category = (0, xss_1.default)(category);
        this.avatar = avatar;
        this.id = (0, xss_1.default)(id || "");
    }
    Contact.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, contacts, categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = (0, database_1.getDb)();
                        if ("message" in db) {
                            throw new Error(db.message);
                        }
                        return [4 /*yield*/, db.collection("contacts").find().toArray()];
                    case 1:
                        contacts = _a.sent();
                        return [4 /*yield*/, db.collection("categories").find().toArray()];
                    case 2:
                        categories = _a.sent();
                        return [2 /*return*/, contacts.map(function (c) {
                                var category = categories.find(function (cat) {
                                    var _a;
                                    return ((_a = cat._id) === null || _a === void 0 ? void 0 : _a.toString()) === c.category.toString();
                                });
                                return __assign(__assign({}, c), { categoryName: category ? category.name : "Category Deleted" });
                            })];
                }
            });
        });
    };
    Contact.prototype.getContact = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, contact;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = (0, database_1.getDb)();
                        if ("message" in db) {
                            throw new Error(db.message);
                        }
                        return [4 /*yield*/, db
                                .collection("contacts")
                                .findOne({ _id: new mongodb_1.ObjectId(this.id) })];
                    case 1:
                        contact = _a.sent();
                        return [2 /*return*/, contact];
                }
            });
        });
    };
    Contact.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        db = (0, database_1.getDb)();
                        if ("message" in db) {
                            throw new Error(db.message);
                        }
                        return [4 /*yield*/, db.collection("contacts").insertOne({
                                name: this.name,
                                phone: this.phone,
                                category: this.category,
                                avatar: this.avatar,
                            })];
                    case 1:
                        result = _a.sent();
                        console.log(result);
                        return [2 /*return*/, result];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contact.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, updateContact, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        db = (0, database_1.getDb)();
                        if ("message" in db) {
                            throw new Error(db.message);
                        }
                        updateContact = {
                            name: this.name,
                            phone: this.phone,
                            category: this.category,
                        };
                        if (this.avatar) {
                            updateContact.avatar = this.avatar;
                        }
                        return [4 /*yield*/, db
                                .collection("contacts")
                                .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: updateContact })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contact.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = (0, database_1.getDb)();
                        if ("message" in db) {
                            throw new Error(db.message);
                        }
                        return [4 /*yield*/, db
                                .collection("contacts")
                                .deleteOne({ _id: new mongodb_1.ObjectId(this.id) })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Contact;
}());
exports.Contact = Contact;
