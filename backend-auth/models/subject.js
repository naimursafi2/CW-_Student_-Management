const mongoose = require("mongoose");

const subjectSchem = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "creator id is required"],
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 30 characters"],
    },
    code: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      maxlength: [10, "subject code exceed 10 characters"],
    },
    credits: {
      type: String,
      required: false,
      trim: true,
      min: [0, "credit cannot be nagative"],
    },
    description: {
      type: String,

      required: false,
      maxlength: [200, "description cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("subject", subjectSchem);
