const express = require("express");
const { createNotice, toggleLike } = require("../../controllers/noticeController");
const { protect, requireAdmin } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, requireAdmin, createNotice);
router.patch("/:id/like", protect, toggleLike);

module.exports = router;
