import { getDb } from "../data/database";

export class User {
  constructor(
    public name?: string,
    public email?: string,
    public password?: string,
    public user_type?: "A" | "U",
    public readonly id?: string
  ) {}

  async searchUser(queryObj: any) {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    return await db.collection("users").findOne(queryObj);
  }

  async create() {
    const db = getDb();
    if ("message" in db) {
      throw new Error(db.message);
    }
    await db.collection("users").insertOne({
      name: this.name,
      email: this.email,
      password: this.password,
      user_type: this.user_type,
    });
  }
}
