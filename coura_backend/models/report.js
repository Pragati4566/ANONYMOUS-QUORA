const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["question", "answer", "blog", "comment"],
      required: true,
    },

    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    reasons: [String],

    reportCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "blocked", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
