const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "subject", required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
resultSchema.index({ classId: 1, studentId: 1, subjectId: 1 }, { unique: true });
module.exports = mongoose.model("Result", resultSchema);
