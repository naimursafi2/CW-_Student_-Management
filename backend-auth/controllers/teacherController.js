const Class = require("../models/class");
const Attendance = require("../models/attendance");
const Result = require("../models/result");

async function ownClass(req, res) {
  const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user._id }).populate("students", "name email").populate("subjects");
  if (!cls) {
    res.status(403).json({ success: false, message: "You can only access your assigned classes." });
    return null;
  }
  return cls;
}

const getClassDetails = async (req, res) => {
  try {
    const cls = await ownClass(req, res); if (!cls) return;
    return res.json({ success: true, data: { class: cls } });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to load class.", error: error.message }); }
};

const saveAttendance = async (req, res) => {
  try {
    const cls = await ownClass(req, res); if (!cls) return;
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) return res.status(400).json({ success: false, message: "Date and attendance records are required." });
    const allowed = new Set(cls.students.map((student) => String(student._id)));
    if (records.some((record) => !allowed.has(String(record.studentId)) || !["present", "absent"].includes(record.status))) return res.status(400).json({ success: false, message: "Invalid attendance record." });
    await Promise.all(records.map((record) => Attendance.findOneAndUpdate({ classId: cls._id, studentId: record.studentId, date }, { status: record.status, markedBy: req.user._id }, { upsert: true, new: true, setDefaultsOnInsert: true })));
    return res.json({ success: true, message: "Attendance saved successfully." });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to save attendance.", error: error.message }); }
};

const saveResult = async (req, res) => {
  try {
    const cls = await ownClass(req, res); if (!cls) return;
    const { studentId, subjectId, marks } = req.body;
    if (!cls.students.some((student) => String(student._id) === String(studentId)) || !cls.subjects.some((subject) => String(subject._id) === String(subjectId)) || !Number.isFinite(Number(marks)) || Number(marks) < 0 || Number(marks) > 100) return res.status(400).json({ success: false, message: "Student, subject, and marks must belong to this class." });
    await Result.findOneAndUpdate({ classId: cls._id, studentId, subjectId }, { marks: Number(marks), updatedBy: req.user._id }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({ success: true, message: "Marks saved successfully." });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to save marks.", error: error.message }); }
};

module.exports = { getClassDetails, saveAttendance, saveResult };
