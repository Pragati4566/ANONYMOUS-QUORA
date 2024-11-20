const express = require("express");
const router = express.Router();

const commentDB = require("../models/Comment");

router.post("/", async (req, res) => {
  try {
    await commentDB
      .create({
        comment: req.body.comment,
        blogId: req.body.blogId,
        createdAt: Date.now(),
        commentUserId: req.body.userId,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Comment added successfully!",
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
      message: "Error while adding comment!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    await commentDB
      .deleteOne({ _id: commentId })
      .then(() => {
        res.status(200).send({
          status: true,
          message: "Comment deleted successfully!",
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

module.exports = router;
