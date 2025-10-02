import * as multer from "multer";

// File Upload
const storageConfig = multer.diskStorage({
  destination: function (_req: any, _file: any, cb: Function) {
    cb(null, "uploads");
  },
  filename: function (_req: any, file: any, cb: Function) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer.default({ storage: storageConfig });
