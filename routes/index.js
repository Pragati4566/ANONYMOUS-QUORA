const express = require("express");
const router = express.Router();

const questionRouter = require("./Question");
const answerRouter = require("./Answer");
const blogRouter = require("./Blog");
const commentRouter = require("./Comment");
const authRouter = require("./Auth");

router.get("/", (req, res) => {
  res.send("Welcome to Coura!");
});

router.use("/questions", questionRouter);
router.use("/answers", answerRouter);
router.use("/blogs", blogRouter);
router.use("/comments", commentRouter);
router.use("/auth", authRouter);

module.exports = router;
