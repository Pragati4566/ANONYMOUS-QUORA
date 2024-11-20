const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: { type: String },
  questionUrl: { type: String },
  category: { type: String },
  quesUpvotes: Number,
  quesDownvotes: Number,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "answers",
  },
  quesUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answeredByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("Questions", QuestionSchema);
