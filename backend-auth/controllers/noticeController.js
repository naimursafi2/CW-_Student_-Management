const Notice = require("../models/noticeSchema");
const mongoose = require("mongoose");

const createNotice = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const errors = {};

    if (!title || !title.trim()) errors.title = "Title is required.";
    if (!description || !description.trim()) {
      errors.description = "Description is required.";
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, message: errors });
    }

    const notice = await Notice.create({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl?.trim() || undefined,
      postedBy: req.user._id,
    });

    await notice.populate("postedBy", "name role");

    return res.status(201).json({
      success: true,
      message: "Notice created successfully.",
      data: { notice, liked: notice.likes.length },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID.",
      });
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found.",
      });
    }

    const alreadyLiked = notice.likes.some((userId) => userId.equals(req.user._id));

    if (alreadyLiked) {
      notice.likes.pull(req.user._id);
    } else {
      notice.likes.push(req.user._id);
    }

    await notice.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Notice unliked successfully." : "Notice liked successfully.",
      data: {
        liked: !alreadyLiked,
        likesCount: notice.likes.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        notices: notices.map((notice) => ({
          id: notice._id,
          title: notice.title,
          description: notice.description,
          imageUrl: notice.imageUrl,
          postedBy: notice.postedBy,
          likesCount: notice.likes.length,
          liked: notice.likes.some((userId) => userId.equals(req.user._id)),
          createdAt: notice.createdAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to retrieve notices.", error: error.message });
  }
};

module.exports = { createNotice, getNotices, toggleLike };
