const fs = require("fs");
const path = require("path");

async function getFileData(filename) {
  const filePath = path.join(__dirname, "../", "data", filename);
  const fileData = await fs.readFileSync(filePath);
  return JSON.parse(fileData);
}

module.exports = {
  getFileData,
};
