import multer from "multer";
import path from "path";

// Use memory storage (since we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

// File type filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only! (jpg, jpeg, png)");
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

export default upload;
