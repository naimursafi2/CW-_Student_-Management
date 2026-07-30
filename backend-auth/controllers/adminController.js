const { ReturnDocument } = require("mongodb");
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
    isEmailVerfied: user.isEmailVerfied,
    createdAt: user.createdAt,
  };
}

const getAllUsers = async (req, res, next) => {
  try {
    const alluser = await User.find({ role: ["student", "teacher"] });
    return res
      .status(200)
      .send({ success: true, message: "user get successfully", user: alluser });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "user get failed",
      error: error.message,
    });
  }
};

const approvedUserRole = async (req, res) => {
  try {
    const params = req.params.id;
    const updateRole = await User.findByIdAndUpdate(
      params,
      {
        isApproved: true,
      },
      { ReturnDocument: "after" },
    );
    return res
      .status(200)
      .send({
        success: true,
        message: "role updated successfully",
        data: { user: updateRole },
      });
  } catch (error) {
    return res
      .status(500)
      .send({
        success: false,
        message: "role updated failed",
        error: error.message,
      });
  }
};

const deleteUser = async (req, res) => {
  try {
    const params = req.params.id;
    const deleteUser = await User.findByIdAndDelete(params);
    return res
      .status(200)
      .send({ success: true, message: "user deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({
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

    const total = await user.countDocuments(filter);
    const pendingUsers = await user
      .find(filter)
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
          hasPrevPage: Page > 1,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

module.exports = { getAllUsers, approvedUserRole, deleteUser, getPendingUsers };
