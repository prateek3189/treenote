import { ObjectId } from "mongodb";
import { getDb } from "../data/database";
import { ICategory } from "../types";
import xss from "xss";

export class Category {
  name: string;
  id: string;

  constructor(name: string, id?: string) {
    this.name = xss(name);
    this.id = id || "";
  }

  static async getAll(): Promise<ICategory[]> {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    const categoryDocs = await db.collection("categories").find().toArray();
    const categories: ICategory[] = categoryDocs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name as string,
    }));
    return categories;
  }

  async getCategory(): Promise<ICategory | null> {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    const category = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(this.id) });
    if (!category) {
      return null;
    }
    return {
      _id: category._id.toString(),
      name: category.name as string,
    };
  }

  async save() {
    const db = getDb();
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
      const db = getDb();
      if ("message" in db) {
        throw new Error(db.message);
      }
      const result = await db
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
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    const result = await db
      .collection("categories")
      .deleteOne({ _id: new ObjectId(this.id) });
    return result;
  }
}
