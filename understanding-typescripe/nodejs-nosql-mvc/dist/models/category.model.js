"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../data/database");
const xss_1 = __importDefault(require("xss"));
class Category {
    name;
    id;
    constructor(name, id) {
        this.name = (0, xss_1.default)(name);
        this.id = id || "";
    }
    static async getAll() {
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const categoryDocs = await db.collection("categories").find().toArray();
        const categories = categoryDocs.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
        }));
        return categories;
    }
    async getCategory() {
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const category = await db
            .collection("categories")
            .findOne({ _id: new mongodb_1.ObjectId(this.id) });
        if (!category) {
            return null;
        }
        return {
            _id: category._id.toString(),
            name: category.name,
        };
    }
    async save() {
        const db = (0, database_1.getDb)();
        if ("message" in db) {
            throw new Error(db.message);
        }
        const result = await db
            .collection("categories")
            .insertOne({ name: this.name });
        return result;
    }
    async update() {
        try {
            const db = (0, database_1.getDb)();
            if ("message" in db) {
                throw new Error(db.message);
            }
            const result = await db
                .collection("categories")
                .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: { name: this.name } });
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
            .collection("categories")
            .deleteOne({ _id: new mongodb_1.ObjectId(this.id) });
        return result;
    }
}
exports.Category = Category;
//# sourceMappingURL=category.model.js.map