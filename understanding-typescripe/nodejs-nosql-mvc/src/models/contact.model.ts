import { ObjectId } from "mongodb";
import { getDb } from "../data/database";
import { IContact, IContactWithCategory } from "../types";
import xss from "xss";

export class Contact {
  name: string;
  phone: string;
  category: string;
  avatar: string;
  id: string;

  constructor(
    name: string,
    phone: string,
    category: string,
    avatar: string,
    id?: string
  ) {
    this.name = xss(name);
    this.phone = xss(phone);
    this.category = xss(category);
    this.avatar = avatar;
    this.id = xss(id || "");
  }

  static async getAll(): Promise<IContactWithCategory[]> {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }

    const contacts = await db.collection("contacts").find().toArray();
    const categories = await db.collection("categories").find().toArray();

    return contacts.map((c: any): IContactWithCategory => {
      const category = categories.find((cat: any) => {
        return cat._id?.toString() === c.category.toString();
      });

      return {
        ...c,
        categoryName: category ? category.name : "Category Deleted",
      };
    });
  }

  async getContact(): Promise<IContact | null> {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    const contact = await db
      .collection("contacts")
      .findOne({ _id: new ObjectId(this.id) });
    return contact as unknown as IContact | null;
  }

  async save() {
    try {
      const db = getDb();
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
    } catch (e) {
      console.log(e);
    }
  }

  async update() {
    try {
      const db = getDb();
      if ("message" in db) {
        throw new Error(db.message);
      }
      const updateContact: IContact = {
        name: this.name,
        phone: this.phone,
        category: this.category,
      };
      if (this.avatar) {
        updateContact.avatar = this.avatar;
      }
      const result = await db
        .collection("contacts")
        .updateOne({ _id: new ObjectId(this.id) }, { $set: updateContact });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async delete() {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    const result = await db
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(this.id) });
    return result;
  }
}
