const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const userDB = require("../models/User");

router.post("/", async (req, res) => {
  try {
    await questionDB
      .create({
        questionName: req.body.questionName,
        questionUrl: req.body.questionUrl,
        createdAt: Date.now(),
        category: req.body.category,
        quesUserId: req.body.userId,
        quesUpvotes: 0,
        quesDownvotes: 0,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Question added successfully!",
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Bad request!",
        });
      });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while adding question!",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const quesId = req.params.id;
    await questionDB
      .updateOne(
        { _id: quesId },
        {
          $set: {
            questionName: req.body.questionName,
            questionUrl: req.body.questionUrl,
            category: req.body.category,
          },
        }
      )
      .then(() => {
        res.status(200).send({
          status: true,
          message: "Question updated successfully!",
        });
      })
      .catch((err) => {
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
      ])
      .exec()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
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
    await userDB
      .findOne({ _id: userId })
      .then(async () => {
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
          ])
          .then((data) => {
            res.status(200).send({
              status: true,
              message: "Questions fetched successfully!",
              data: data,
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

router.post("/votes", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await userDB.findById(userId).exec();
    var votes = user.votes;

    res.status(200).send({
      status: true,
      message: "Returning user votes",
      votes: votes,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while fetching votes of user",
    });
  }
});

module.exports = router;
