import express from "express";
import session from "express-session";
import path from "path";

import { connectToDatabse } from "./data/database";
import defaultRoutes from "./routes/default.route";
import contactRoutes from "./routes/contact.route";
import categoryRoutes from "./routes/category.route";
import { createSessionStore, createSessionConfig } from "./config/session";
import authMiddleware from "./middleware/auth-middleware";

const app = express();
const mongoDbSessionStore = createSessionStore(session);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session(createSessionConfig(mongoDbSessionStore) as session.SessionOptions)
);

app.use(authMiddleware);

app.use("/", defaultRoutes);
app.use("/contacts", contactRoutes);
app.use("/categories", categoryRoutes);

app.use(function (req: any, res: any) {
  res.status(404).render("404");
});

app.use(function (error: any, req: any, res: any, next: any) {
  res.status(500).render("500");
});

connectToDatabse().then(() => {
  app.listen(3001);
  console.log("Running on http://localhost:3001");
});
