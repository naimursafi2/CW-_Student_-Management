const subject = require("../models/subject");
const mongoosePaginate = require('mongoose-paginate-v2')

const createSubject = async (req, res) => {
  const { creatorId, subName, code, credits, description } = req.body;

  if (!creatorId)
    return res.status(400).send({ message: "please enter your creatorId" });
  if (!subName)
    return res.status(400).send({ message: "please enter your subject Name" });
  if (!code) return res.status(400).send({ message: "please enter your code" });

  const newSubject = new subject({
    creatorId,
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
  const Subjects = await subject.find();
  res.status(201).send({ message: "data get successfully", data: Subjects });
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubject = await subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).send({message: "Subject not found!"});
    }

    res.status(200).send({
      message: "Subject deleted successfully!", data: deletedSubject,});

  } catch (error) {
    console.log(error);

    res.status(500).send({message: "Error deleting subject!"});
  }
};;

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
  }}

module.exports = { createSubject, getSubject, deleteSubject,updateSubject };
