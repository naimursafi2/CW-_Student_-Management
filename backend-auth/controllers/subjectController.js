const subject = require("../models/subject");
const mongoosePaginate = require("mongoose-paginate-v2");
const Class = require("../models/Class");

const createSubject = async (req, res) => {
  const { subName, code, credits, description } = req.body;

  if (!subName)
    return res.status(400).send({ message: "please enter your subject Name" });
  if (!code) return res.status(400).send({ message: "please enter your code" });

  const newSubject = new subject({
    creatorId: req.user._id,
    subName,
    code,
    credits,
    description,
  });
  await newSubject.save();
  res
    .status(201)
    .send({ message: "Subject created successfully", data: newSubject });
};

const getSubject = async (req, res) => {
  const filter = req.user.role === "student"
    ? { _id: { $in: (await Class.find({ students: req.user._id }).select("subjects")).flatMap((cls) => cls.subjects) } }
    : {};
  const subjects = await subject.find(filter);
  res.status(200).send({ message: "data get successfully", data: subjects });
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubject = await subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).send({ message: "Subject not found!" });
    }

    res.status(200).send({
      message: "Subject deleted successfully!",
      data: deletedSubject,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Error deleting subject!" });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credits, description } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    if (name) subject.name = name;
    if (code) subject.code = code;
    if (credits !== undefined) subject.credits = credits;
    if (description !== undefined) subject.description = description;

    await subject.save();

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating subject.",
      error: error.message,
    });
  }
};

const subjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectInfo = await subject.findById(id);
    return res.status(400).send({
      message: "subject id doesn't match",
    });
    return res
      .status(200)
      .send({
        success: true,
        message: "subject retrived successfully",
        data: subjectById,
      });
  } catch (error) {
    return res
      .status(500)
      .send({
        success: false,
        message: "subject retrived failde",
        error: error.message,
      });
    return;
  }
};

module.exports = {
  createSubject,
  getSubject,
  deleteSubject,
  updateSubject,
  subjectById,
};
