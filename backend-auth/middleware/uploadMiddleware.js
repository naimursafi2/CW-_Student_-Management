const multer = require("multer");
const imageFilter = (_req, file, callback) => {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return callback(null, true);
  callback(new Error("Only JPG, PNG, and WEBP images are allowed."));
};

// Keep image bytes only in memory until Cloudinary receives them.
module.exports = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter, limits: { fileSize: 3 * 1024 * 1024 } });
