const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["present", "absent"], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
attendanceSchema.index({ classId: 1, studentId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Attendance", attendanceSchema);
