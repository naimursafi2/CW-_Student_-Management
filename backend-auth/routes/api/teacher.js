const express = require("express");
const { protect, requireTeacher, requireVerifiedEmail } = require("../../middleware/authMiddleware");
const { getClassDetails, saveAttendance, saveResult } = require("../../controllers/teacherController");
const router = express.Router();

router.use(protect, requireVerifiedEmail, requireTeacher);
router.get("/classes/:classId", getClassDetails);
router.post("/classes/:classId/attendance", saveAttendance);
router.put("/classes/:classId/results", saveResult);
module.exports = router;
