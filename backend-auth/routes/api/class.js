const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../../middleware/authMiddleware");
const { requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const classController = require("../../controllers/classController.js");

router.use(protect, requireAdmin, requireVerifiedEmail);
router.post("/create", classController.createClass);
router.get("/get", classController.getClasses);
router.put("/update/:id", classController.updateClass);
router.delete("/delete/:id", classController.deleteClass);

module.exports = router;