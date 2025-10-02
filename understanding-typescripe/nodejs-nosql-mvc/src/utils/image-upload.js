"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer = require("multer");
// File Upload
var storageConfig = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, "uploads");
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
exports.upload = multer.default({ storage: storageConfig });
