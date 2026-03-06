import multer from "multer";

// Memory storage (can switch to S3 later)
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "application/pdf",
   "image/vnd.microsoft.icon"
];

// File filter for security
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB per file
  },
  fileFilter
});

// 🔹 Limit file counts here
export const uploadGemFiles = upload.fields([
  { name: "images", maxCount: 10 }, // max 10 images
  { name: "video", maxCount: 1 },   // 1 video only
  { name: "pdf", maxCount: 1 }      // 1 pdf only
]);