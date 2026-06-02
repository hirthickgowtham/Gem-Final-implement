import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/vnd.microsoft.icon",
  "image/x-icon",
  "video/mp4",
  "application/pdf",
  "video/quicktime",
  "video/x-matroska",
  "video/x-msvideo",
  "video/webm",
  "video/mpeg",
  "video/ogg",
  "video/3gpp"
];

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".mp4",
  ".pdf",
  ".ico",
  ".mov",
  ".mkv",
  ".avi",
  ".webm",
  ".mpeg",
  ".ogg",
  ".3gp"
];

const fileFilter = (req, file, cb) => {

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

export const uploadGemFiles = upload.array("files", 12);