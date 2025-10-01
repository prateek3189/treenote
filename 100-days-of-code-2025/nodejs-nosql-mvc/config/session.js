const mongodbStore = require("connect-mongodb-session");

function createSessionStore(session) {
  const MongoDBStore = mongodbStore(session);
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

module.exports = { createSessionStore, createSessionConfig };
