const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "treenote",
  user: "root",
  password: "invincible",
});

module.exports = pool;
