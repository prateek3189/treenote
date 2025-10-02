import * as mongodb from "mongodb";
import { DatabaseResult } from "../types";

const MongoClient = mongodb.MongoClient;

let database: mongodb.Db | null = null;

export async function connectToDatabse(): Promise<void> {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("treenote");
}

export function getDb(): DatabaseResult {
  if (!database) {
    return { message: "Database is not connected" };
  }
  return database;
}
