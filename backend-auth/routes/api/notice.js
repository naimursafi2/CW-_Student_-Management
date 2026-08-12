const express = require("express");
const { createNotice, getNotices, toggleLike } = require("../../controllers/noticeController");
const { protect, requireAdmin, requireVerifiedEmail } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, requireVerifiedEmail, requireAdmin, createNotice);
router.get("/get", protect, requireVerifiedEmail, getNotices);
router.patch("/:id/like", protect, requireVerifiedEmail, toggleLike);

module.exports = router;
