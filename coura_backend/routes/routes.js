const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Report = require("../models/report");
const Answer = require("../models/answer");
const Question = require("../models/question");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const auth = require("../middlewares/auth");

// REPORT THRESHOLD
const REPORT_THRESHOLD = 5;

/**
 * REPORT CONTENT (Question / Answer / Blog / Comment)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { contentType, contentId, reason } = req.body;
    const userId = req.user.id;

    if (!contentType || !contentId) {
      return res.status(400).json({ message: "Invalid report data" });
    }

    let report = await Report.findOne({ contentType, contentId });

    // First report
    if (!report) {
      report = await Report.create({
        contentType,
        contentId,
        reportedBy: [userId],
        reasons: [reason],
        reportCount: 1,
      });
    } else {
      // Prevent duplicate reporting
      if (report.reportedBy.includes(userId)) {
        return res.status(400).json({ message: "Already reported by you" });
      }

      report.reportedBy.push(userId);
      report.reasons.push(reason);
      report.reportCount += 1;

      // Threshold check
      if (report.reportCount >= REPORT_THRESHOLD) {
        report.status = "blocked";
      }

      await report.save();
    }

    res.json({ message: "Report submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: GET FLAGGED REPORTS
 */
router.get("/admin", auth, async (req, res) => {
  try {
    // check admin role
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const reports = await Report.find({ status: "blocked" })
      .sort({ reportCount: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN: DELETE CONTENT & RESOLVE REPORT
 */
router.delete("/admin/:reportId", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const { contentType, contentId } = report;

    // Delete actual content
    if (contentType === "question") {
      await Question.findByIdAndDelete(contentId);
    } else if (contentType === "answer") {
      await Answer.findByIdAndDelete(contentId);
    } else if (contentType === "blog") {
      await Blog.findByIdAndDelete(contentId);
    } else if (contentType === "comment") {
      await Comment.findByIdAndDelete(contentId);
    }

    report.status = "resolved";
    await report.save();

    res.json({ message: "Content deleted & report resolved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
