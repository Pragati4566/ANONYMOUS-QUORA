const express = require("express");
const router = express.Router();

const answerDB = require("../models/Answer");
const userDB = require("../models/User");
const questionDB = require("../models/Question");

// POST request to add a new answer
router.post("/", async (req, res) => {
  try {
    // MongoDB me answer create kar rahe hain
    await answerDB
      .create({
        answer: req.body.answer,           // frontend se aaya answer text
        questionId: req.body.questionId,   // kis question ka answer hai
        createdAt: Date.now(),             // answer ka time
        ansUserId: req.body.userId,        // kis user ne answer diya
      })

      // agar answer successfully add ho gaya
      .then(async () => {
        // Question collection me userId push kar rahe hain (jo answer diya)
        await questionDB.updateOne(
          { _id: req.body.questionId },  // question ka ID find karo
          { $push: { answeredByUsers: req.body.userId } } // user ko list me add karo
        );

        // success response bhejo frontend ko
        res.status(201).send({
          status: true,
          message: "Answer added successfully!",
        });
      })

      // agar answer add nahi hua (bad data)
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Bad request!",
        });
      });

  } catch (err) {
    // agar server crash ya unexpected error aaye
    res.status(500).send({
      status: false,
      message: "Error while adding answer!",
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const ansId = req.params.id;
    await answerDB
      .updateOne({ _id: ansId }, { $set: { answer: req.body.answer } })
      .then(() => {
        res.status(200).send({
          status: true,
          message: "Answer updated successfully!",
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

router.delete("/:id/:quesId/:userId", async (req, res) => {
  try {
    const ansId = req.params.id;
    const quesId = req.params.quesId;
    const userId = req.params.userId;

    await answerDB
      .deleteOne({ _id: ansId })
      .then(async () => {
        await questionDB.updateOne(
          { _id: quesId },
          { $pull: { answeredByUsers: userId } }
        );

        res.status(200).send({
          status: true,
          message: "Answer deleted successfully!",
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

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await userDB
      .findOne({ _id: userId })
      .then(async () => {
        questionDB
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
          .then((data) => {
            var newData = [];
            for (let i = 0; i < data.length; i++) {
              let obj = data[i];
              let flag = false;
              for (let j = 0; j < obj.answeredByUsers.length; j++) {
                if (obj.answeredByUsers[j] == userId) {
                  flag = true;
                  break;
                }
              }
              if (flag) newData.push(obj);
            }
            res.status(200).send({
              status: true,
              message: "Answers fetched successfully!",
              data: newData,
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
      message: "Error while getting answers!",
    });
  }
});

module.exports = router;
