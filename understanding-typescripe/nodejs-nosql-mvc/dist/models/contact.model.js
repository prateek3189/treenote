"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../data/database");
const xss_1 = __importDefault(require("xss"));
class Contact {
    name;
    phone;
    category;
    avatar;
    id;
    constructor(name, phone, category, avatar, id) {
        this.name = (0, xss_1.default)(name);
        this.phone = (0, xss_1.default)(phone);
        this.category = (0, xss_1.default)(category);
        this.avatar = avatar;
        this.id = (0, xss_1.default)(id || "");
    }
    static async getAll() {
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const contacts = await db.collection("contacts").find().toArray();
        const categories = await db.collection("categories").find().toArray();
        return contacts.map((c) => {
            const category = categories.find((cat) => {
                return cat._id?.toString() === c.category.toString();
            });
            return {
                ...c,
                categoryName: category ? category.name : "Category Deleted",
            };
        });
    }
    async getContact() {
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const contact = await db
            .collection("contacts")
            .findOne({ _id: new mongodb_1.ObjectId(this.id) });
        return contact;
    }
    async save() {
        try {
            const db = (0, database_1.getDb)();
            if ("message" in db) {
                throw new Error(db.message);
            }
            const result = await db.collection("contacts").insertOne({
                name: this.name,
                phone: this.phone,
                category: this.category,
                avatar: this.avatar,
            });
            console.log(result);
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    async update() {
        try {
            const db = (0, database_1.getDb)();
            if ("message" in db) {
                throw new Error(db.message);
            }
            const updateContact = {
                name: this.name,
                phone: this.phone,
                category: this.category,
            };
            if (this.avatar) {
                updateContact.avatar = this.avatar;
            }
            const result = await db
                .collection("contacts")
                .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: updateContact });
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
    async delete() {
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const result = await db
            .collection("contacts")
            .deleteOne({ _id: new mongodb_1.ObjectId(this.id) });
        return result;
    }
}
exports.Contact = Contact;
//# sourceMappingURL=contact.model.js.map