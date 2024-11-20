const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogs",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  commentUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Comments", CommentSchema);
