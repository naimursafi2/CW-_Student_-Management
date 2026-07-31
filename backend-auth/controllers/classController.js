const mongoosePaginate = require('mongoose-paginate-v2')
const Class = require("../models/Class");
const Subject = require("../models/subject");

function formatClass(cls) {
  return {
    id: cls._id,
    name: cls.name,
    code: cls.code,
    description: cls.description,
    creatorId: cls.creatorId,
    subjects: cls.subjects || [],
    createdAt: cls.createdAt,
    updatedAt: cls.updatedAt,
  };
}

const createClass = async (req, res) => {
  try {
    const { name, code, description, creatorId, subjects } = req.body;

    if (!name || !code || !creatorId) {
      return res.status(400).json({
        success: false,
        message: "Name, code, and creatorId are required.",
      });
    }

    const newClass = new Class({
      name,
      code,
      description,
      creatorId,
      subjects: subjects || [],
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: {
        path: "subjects",
        model: "Subject",
      },
    };

    const result = await paginate(Class, {}, options);
    const classes = result.docs.map(formatClass);

    return res.status(200).json({
      success: true,
      message: "Classes retrieved successfully.",
      data: {
        classes,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
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
    const { name, code, description, subjects } = req.body;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    if (name !== undefined) cls.name = name;
    if (code !== undefined) cls.code = code;
    if (description !== undefined) cls.description = description;
    if (subjects !== undefined) cls.subjects = subjects;

    await cls.save();

    res.status(200).json({
      success: true,
      message: "Class updated successfully.",
      data: formatClass(cls),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating class.",
      error: error.message,
    });
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
};
