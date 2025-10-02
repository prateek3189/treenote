"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionStore = createSessionStore;
exports.createSessionConfig = createSessionConfig;
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
function createSessionStore(session) {
    const MongoDBStore = (0, connect_mongodb_session_1.default)(session);
    const sessionStore = new MongoDBStore({
        uri: "mongodb://127.0.0.1:27017",
        databaseName: "treenote",
        collection: "sessions",
    });
    return sessionStore;
}
function createSessionConfig(sessionStore) {
    return {
        secret: "TREENOTE",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
        },
    };
}
//# sourceMappingURL=session.js.map