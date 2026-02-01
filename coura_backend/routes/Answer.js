const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const answerDB = require("../models/Answer");
const userDB = require("../models/User");
const questionDB = require("../models/Question");

router.post("/", async (req, res) => {
  try {
    //  ANSWER LENGTH LIMIT
    if (!req.body.answer || req.body.answer.length > 2000) {
      return res.status(400).json({
        status: false,
        message: "Answer too long. Max 2000 characters allowed.",
      });
    }

    await answerDB.create({
      answer: req.body.answer,
      questionId: req.body.questionId,
      createdAt: Date.now(),
      ansUserId: req.body.userId,
    });

    await questionDB.updateOne(
      { _id: req.body.questionId },
      { $push: { answeredByUsers: req.body.userId } }
    );

    res.status(201).send({
      status: true,
      message: "Answer added successfully!",
    });

  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while adding answer!",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    //  UPDATE ANSWER LIMIT ALSO
    if (!req.body.answer || req.body.answer.length > 2000) {
      return res.status(400).json({
        status: false,
        message: "Answer too long. Max 2000 characters allowed.",
      });
    }

    const ansId = req.params.id;

    await answerDB.updateOne(
      { _id: ansId },
      { $set: { answer: req.body.answer } }
    );

    res.status(200).send({
      status: true,
      message: "Answer updated successfully!",
    });

  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.delete("/:id/:quesId/:userId", async (req, res) => {
  try {
    const ansId = req.params.id;
    const quesId = req.params.quesId;
    const userId = req.params.userId;

    await answerDB.deleteOne({ _id: ansId });

    await questionDB.updateOne(
      { _id: quesId },
      { $pull: { answeredByUsers: userId } }
    );

    res.status(200).send({
      status: true,
      message: "Answer deleted successfully!",
    });

  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const totalRecords = await questionDB.countDocuments({
      answeredByUsers: userObjectId,
    });

    const data = await questionDB.aggregate([
      { $match: { answeredByUsers: userObjectId } },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.status(200).send({
      status: true,
      message: "Answers fetched successfully!",
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      data,
    });

  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while getting answers!",
    });
  }
});

module.exports = router;
