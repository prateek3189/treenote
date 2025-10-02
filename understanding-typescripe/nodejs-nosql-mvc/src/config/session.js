"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionStore = createSessionStore;
exports.createSessionConfig = createSessionConfig;
var connect_mongodb_session_1 = require("connect-mongodb-session");
function createSessionStore(session) {
    var MongoDBStore = (0, connect_mongodb_session_1.default)(session);
    var sessionStore = new MongoDBStore({
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
