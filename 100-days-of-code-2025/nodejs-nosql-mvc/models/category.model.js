const { ObjectId } = require("mongodb");
const db = require("../data/database");
const xss = require("xss");

class Category {
  constructor(name, id) {
    this.name = xss(name);
    this.id = id;
  }

  static async getAll() {
    const categories = await db
      .getDb()
      .collection("categories")
      .find()
      .toArray();
    return categories;
  }

  async getCategory() {
    const category = await db
      .getDb()
      .collection("categories")
      .findOne({ _id: new ObjectId(this.id) });
    return category;
  }

  async save() {
    const result = await db
      .getDb()
      .collection("categories")
      .insertOne({ name: this.name });
    return result;
  }

  async update() {
    try {
      const result = await db
        .getDb()
        .collection("categories")
        .updateOne(
          { _id: new ObjectId(this.id) },
          { $set: { name: this.name } }
        );
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async delete() {
    const result = await db
      .getDb()
      .collection("categories")
      .deleteOne({ _id: new ObjectId(this.id) });
    return result;
  }
}

module.exports = Category;
