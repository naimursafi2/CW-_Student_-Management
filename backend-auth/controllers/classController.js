const Class = require("../models/Class");
const Subject = require("../models/subject");
const User = require("../models/User");

function formatClass(cls) {
  return {
    id: cls._id,
    name: cls.name,
    code: cls.code,
    description: cls.description,
    creatorId: cls.creatorId,
    subjects: cls.subjects || [],
    students: cls.students || [],
    createdAt: cls.createdAt,
    updatedAt: cls.updatedAt,
  };
}

const createClass = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required.",
      });
    }

    const normalizedCode = code.trim().toUpperCase();
    const existingClass = await Class.findOne({ code: normalizedCode }).collation({ locale: "en", strength: 2 });
    if (existingClass) {
      return res.status(409).json({ success: false, message: `A class with code ${normalizedCode} already exists.` });
    }

    const newClass = new Class({
      name,
      code: normalizedCode,
      description,
      creatorId: req.user._id,
      subjects: [],
      students: [],
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: "Class created successfully.",
      data: formatClass(newClass),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating class.",
      error: error.message,
    });
  }
};

const getClasses = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { students: req.user._id } : {};
    const classes = await Class.find(filter)
      .populate("subjects")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Classes retrieved successfully.",
      data: {
        classes: classes.map(formatClass),
        pagination: { totalItems: classes.length },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve classes.",
      error: error.message,
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, subjects, students } = req.body;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    if (name !== undefined) cls.name = name;
    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase();
      const duplicate = await Class.findOne({ _id: { $ne: id }, code: normalizedCode }).collation({ locale: "en", strength: 2 });
      if (duplicate) {
        return res.status(409).json({ success: false, message: `A class with code ${normalizedCode} already exists.` });
      }
      cls.code = normalizedCode;
    }
    if (description !== undefined) cls.description = description;
    if (subjects !== undefined) {
      const validSubjects = await Subject.countDocuments({ _id: { $in: subjects } });
      if (validSubjects !== subjects.length) {
        return res.status(400).json({ success: false, message: "Select valid subjects only." });
      }
      cls.subjects = subjects;
    }
    if (students !== undefined) {
      const validStudents = await User.countDocuments({ _id: { $in: students }, role: "student" });
      if (validStudents !== students.length) {
        return res.status(400).json({ success: false, message: "Select valid student accounts only." });
      }
      cls.students = students;
    }

    await cls.save();

    res.status(200).json({
      success: true,
      message: "Class updated successfully.",
      data: formatClass(cls),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "A class with this class code already exists." });
    }
    res.status(500).json({
      success: false,
      message: "Error updating class.",
      error: error.message,
    });
  }
};

const getAssignableStudents = async (_req, res) => {
  try {
    const students = await User.find({ role: "student", isEmailVerified: true })
      .select("name email")
      .sort({ name: 1 });
    return res.status(200).json({ success: true, data: { students } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to retrieve students.", error: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    await Class.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Class deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting class.",
      error: error.message,
    });
  }
};

module.exports = {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  getAssignableStudents,
};
