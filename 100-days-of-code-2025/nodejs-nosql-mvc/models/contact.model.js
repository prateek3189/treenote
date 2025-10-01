const { ObjectId } = require("mongodb");
const db = require("../data/database");
const xss = require("xss");

class Contact {
  constructor(name, phone, category, avatar, id) {
    this.name = xss(name);
    this.phone = xss(phone);
    this.category = xss(category);
    this.avatar = avatar;
    this.id = xss(id);
  }

  static async getAll() {
    const contacts = await db.getDb().collection("contacts").find().toArray();
    const categories = await db
      .getDb()
      .collection("categories")
      .find()
      .toArray();
    return contacts.map((c) => {
      const category = categories.find((cat) => {
        return cat._id.toString() === c.category.toString();
      });

      const contact = {
        ...c,
        categoryName: category ? category.name : "Category Deleted",
      };
      return contact;
    });
  }

  async getContact() {
    const contact = await db
      .getDb()
      .collection("contacts")
      .findOne({ _id: new ObjectId(this.id) });
    return contact;
  }

  async save() {
    try {
      const result = await db.getDb().collection("contacts").insertOne({
        name: this.name,
        phone: this.phone,
        category: this.category,
        avatar: this.avatar,
      });
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async update() {
    try {
      const updateContact = {
        name: this.name,
        phone: this.phone,
        category: this.category,
      };
      if (this.avatar) {
        updateContact.avatar = this.avatar;
      }
      const result = db
        .getDb()
        .collection("contacts")
        .updateOne({ _id: new ObjectId(this.id) }, { $set: updateContact });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async delete() {
    const result = db
      .getDb()
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(this.id) });
    return result;
  }
}

module.exports = Contact;
