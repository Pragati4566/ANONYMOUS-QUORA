const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const userDB = require("../models/User");
router.post("/", async (req, res) => {
  try {
    if (!req.body.questionName || req.body.questionName.length > 300) {
      return res.status(400).json({
        status: false,
        message: "Question too long. Max 300 characters allowed.",
      });
    }

    // 🔍 CHECK SIMILAR QUESTIONS
    const similarQuestions = await questionDB.find(
      { $text: { $search: req.body.questionName } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(5);

    // if similar found → suggest instead of creating
    if (similarQuestions.length > 0) {
      return res.status(200).json({
        status: false,
        message: "Similar questions already exist",
        suggestions: similarQuestions,
      });
    }

    // CREATE QUESTION
    await questionDB.create({
      questionName: req.body.questionName,
      questionUrl: req.body.questionUrl,
      createdAt: Date.now(),
      category: req.body.category,
      quesUserId: req.body.userId,
      quesUpvotes: 0,
      quesDownvotes: 0,
    });

    res.status(201).send({
      status: true,
      message: "Question added successfully!",
    });

  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while adding question!",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const quesId = req.params.id;
    await questionDB
      .deleteOne({ _id: quesId })
      .then(async () => {
        await answerDB
          .deleteMany({ questionId: quesId })
          .then(() => {
            res.status(200).send({
              status: true,
              message: "Question deleted successfully!",
            });
          })
          .catch(() => {
            res.status(400).send({
              status: false,
              message: "Bad request!",
            });
          });
      })
      .catch(() => {
        res.status(400).send({
          status: false,
          message: "Bad request!",
        });
      });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalQuestions = await questionDB.countDocuments();

    await questionDB
      .aggregate([
        {
          $lookup: {
            from: "answers",
            localField: "_id",
            foreignField: "questionId",
            as: "allAnswers",
          },
        },
        { $sort: { createdAt: -1 } }, // latest first
        { $skip: skip },
        { $limit: limit },
      ])
      .then((data) => {
        res.status(200).send({
          status: true,
          currentPage: page,
          totalPages: Math.ceil(totalQuestions / limit),
          totalQuestions,
          data,
        });
      })
      .catch(() => {
        res.status(400).send({
          status: false,
          message: "Unable to get the question details!",
        });
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

    await userDB
      .findOne({ _id: userId })
      .then(async () => {

        const totalQuestions = await questionDB.countDocuments({
          quesUserId: userId,
        });

        questionDB
          .aggregate([
            {
              $match: {
                quesUserId: new mongoose.Types.ObjectId(userId),
              },
            },
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
          ])
          .then((data) => {
            res.status(200).send({
              status: true,
              message: "Questions fetched successfully!",
              currentPage: page,
              totalPages: Math.ceil(totalQuestions / limit),
              totalQuestions,
              data,
            });
          })
          .catch(() => {
            res.status(400).send({
              status: false,
              message: "Bad request!",
            });
          });
      })
      .catch(() => {
        return res.status(400).send({
          status: false,
          message: "User not found!",
        });
      });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while getting questions!",
    });
  }
});

router.post("/upvotes", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;

  try {
    const user = await userDB.findById(userId).exec();
    const ques = await questionDB.findById(postId).exec();
    const choice = user.votes.get(postId);
    var message = "";

    if (choice === undefined || choice === 0) {
      ques.quesUpvotes += 1;
      user.votes.set(postId, 1);
      message = "Question Upvoted";
    } else if (choice == -1) {
      ques.quesDownvotes -= 1;
      ques.quesUpvotes += 1;
      user.votes.set(postId, 1);
      message = "Question Upvoted";
    } else if (choice == 1) {
      ques.quesUpvotes -= 1;
      user.votes.set(postId, 0);
      message = "vote removed";
    }

    await user.save();
    await ques.save();

    res.status(200).send({
      status: true,
      message: message,
      upvotes: ques.quesUpvotes,
      downvotes: ques.quesDownvotes,
      choice: user.votes.get(postId),
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while upvoting question!",
      upvotes: ques.quesUpvotes,
      downvotes: ques.quesDownvotes,
    });
  }
});

router.post("/downvotes", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;

  try {
    const user = await userDB.findById(userId).exec();
    const ques = await questionDB.findById(postId).exec();
    const choice = user.votes.get(postId);
    var message = "";

    if (choice === undefined || choice === 0) {
      ques.quesDownvotes += 1;
      user.votes.set(postId, -1);
      message = "Question Downvoted";
    } else if (choice == 1) {
      ques.quesDownvotes += 1;
      ques.quesUpvotes -= 1;
      user.votes.set(postId, -1);

      message = "Question Downvoted";
    } else if (choice == -1) {
      ques.quesDownvotes -= 1;
      user.votes.set(postId, 0);
      message = "vote removed";
    }

    await ques.save();
    await user.save();

    res.status(200).send({
      status: true,
      message: message,
      upvotes: ques.quesUpvotes,
      downvotes: ques.quesDownvotes,
      choice: user.votes.get(postId),
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while downvoting question!",
      upvotes: ques.quesUpvotes,
      downvotes: ques.quesDownvotes,
    });
  }
});

router.get("/votes", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    const user = await userDB.findById(userId).select("votes");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      votes: user.votes,
    });

  } catch (err) {
    res.status(500).json({ //sending data to the frontend
      
      status: false,
      message: "Error while fetching votes",
    });
  }
});
router.get("/trending", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalQuestions = await questionDB.countDocuments();

    const trendingQuestions = await questionDB.aggregate([
      {
        $addFields: {
          score: { $subtract: ["$quesUpvotes", "$quesDownvotes"] },
        },
      },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
      { $sort: { score: -1, createdAt: -1 } }, // trending + latest
      { $skip: skip },
      { $limit: limit },
    ]);

    res.status(200).send({
      status: true,
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / limit),
      totalQuestions,
      data: trendingQuestions,
    });

  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while fetching trending questions",
    });
  }
});


module.exports = router;
