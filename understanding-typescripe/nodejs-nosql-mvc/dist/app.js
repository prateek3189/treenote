"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./data/database");
const default_route_1 = __importDefault(require("./routes/default.route"));
const contact_route_1 = __importDefault(require("./routes/contact.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const session_1 = require("./config/session");
const auth_middleware_1 = __importDefault(
  require("./middleware/auth-middleware")
);
const app = (0, express_1.default)();
const mongoDbSessionStore = (0, session_1.createSessionStore)(
  express_session_1.default
);
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(
  "/uploads",
  express_1.default.static(path_1.default.join(__dirname, "uploads"))
);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(
  (0, express_session_1.default)(
    (0, session_1.createSessionConfig)(mongoDbSessionStore)
  )
);
app.use(auth_middleware_1.default);
app.use("/", default_route_1.default);
app.use("/contacts", contact_route_1.default);
app.use("/categories", category_route_1.default);
app.use(function (req, res) {
  res.status(404).render("404");
});
app.use(function (error, req, res, next) {
  res.status(500).render("500");
});
(0, database_1.connectToDatabse)().then(() => {
  app.listen(3001);
  console.log("Running on http://localhost:3001");
});
//# sourceMappingURL=app.js.map
