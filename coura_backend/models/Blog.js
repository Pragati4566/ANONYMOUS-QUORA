const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  blogName: { type: String },
  blogUrl: { type: String },
  category: { type: String },
  blogUpvotes: Number,
  blogDownvotes: Number,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
  },
  blogUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Blogs", BlogSchema);
