const User = require("../models/User");

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    address: user.address,
    role: user.role,
    isApproved: user.isApproved,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}

const getAllUsers = async (req, res, next) => {
  try {
    const allUser = await User.find({
      role: { $in: ["student", "teacher"] },
    });
    return res
      .status(200)
      .send({ success: true, message: "user get successfully", user: allUser });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "user get failed",
      error: error.message,
    });
  }
};

const approvedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .send({ message: "user not found", success: false });
    }
    if (user.isApproved) {
      return res
        .status(400)
        .send({ message: "user already approved", success: false });
    }
    user.isApproved = true;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "role updated successfully",
      data: { user: formatUser(user) },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "role updated failed",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const params = req.params.id;
  try {
    const deleteUser = await User.findByIdAndDelete(params);
    if (!deleteUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "user delet failed",
      error: error.message,
    });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = {
      isApproved: false,
      role: { $in: ["teacher", "student"] },
    };

    const total = await User.countDocuments(filter);
    const pendingUsers = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).send({
      success: true,
      message: "Pending users retrieved successfully",
      data: {
        users: pendingUsers.map(formatUser),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemPerPage: limit,
          hasnextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const rejectUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "user not found." });
    if (user.role == "admin")
      return res
        .status(404)
        .send({ success: false, message: "cannot reject admin users." });

    await User.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "user rejected and deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server errror" });
  }
};

const getTeachers = async (req, res) => {
  const { status } = req.query;
  const filter = { role: "teacher" };
  try {
    if (status === "approved") {
      filter.isApproved = true;
    } else if (status === "pending") {
      filter.isApproved = false;
    }

    const teacher = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Teacher retrieve successfully",
      data: {
        teacher: teacher.map(formatUser),
        count: teacher.length,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getStudents = async (req, res) => {
  const { status } = req.query;
  const filter = { role: "student" };
  try {
    if (status === "approved") {
      filter.isApproved = true;
    } else if (status === "pending") {
      filter.isApproved = false;
    }

    const students = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Student retrieve successfully",
      data: {
        students: students.map(formatUser),
        count: students.length,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const studentInfo = await User.findOne({
      _id: id,
      role: "student",
    });
    console.log(studentInfo);

    return res
      .status(200)
      .send({
        success: true,
        message: "success to retrieve message",
        data: studentInfo,
      });
  } catch (error) {}
};

module.exports = {
  getAllUsers,
  approvedUser,
  deleteUser,
  getPendingUsers,
  rejectUser,
  getTeachers,
  getStudents,
  getStudentById,
};
