const subject = require("../models/subject");

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

module.exports = { createSubject, getSubject, deleteSubject };
