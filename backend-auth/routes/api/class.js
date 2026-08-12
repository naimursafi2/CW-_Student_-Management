const express = require("express");
const router = express.Router();
const { protect, requireAdmin, requireVerifiedEmail } = require("../../middleware/authMiddleware");
const classController = require("../../controllers/classController.js");

router.get("/get", protect, requireVerifiedEmail, classController.getClasses);
router.use(protect, requireAdmin, requireVerifiedEmail);
router.get("/students", classController.getAssignableStudents);
router.post("/create", classController.createClass);
router.put("/update/:id", classController.updateClass);
router.delete("/delete/:id", classController.deleteClass);

module.exports = router;
