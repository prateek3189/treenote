import multer from "multer";

// File Upload
const storageConfig = multer.diskStorage({
  destination: function (req: any, file: any, cb: Function) {
    cb(null, "uploads");
  },
  filename: function (req: any, file: any, cb: Function) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer({ storage: storageConfig });
