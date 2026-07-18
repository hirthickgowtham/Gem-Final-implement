import multer from "multer";
import path from "path";

// ✅ Memory storage (best for S3)
const storage = multer.memoryStorage();

// ✅ Allowed MIME types per category
const allowedMimeTypes = {
  images: ["image/jpeg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon","image/avif"],
  videos: ["video/mp4"],
  pdfs: ["application/pdf"]
};

// ✅ Allowed extensions
const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".mp4",
  ".pdf",
  ".ico"
];

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // ❌ Invalid extension
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}`), false);
  }

  // 🔥 Field-based validation
  if (file.fieldname === "images") {
    if (allowedMimeTypes.images.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only image files allowed in 'images'"), false);
  }

  if (file.fieldname === "videos") {
    if (allowedMimeTypes.videos.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only MP4 videos allowed in 'videos'"), false);
  }

  if (file.fieldname === "pdfs") {
    if (allowedMimeTypes.pdfs.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only PDFs allowed in 'pdfs'"), false);
  }

  return cb(new Error("Invalid field name"), false);
};

// ✅ Multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB per file
  },
  fileFilter
});

// ✅ Fields middleware (IMPORTANT CHANGE)
export const updategemFiles = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 5 },
  { name: "pdfs", maxCount: 5 }
]);