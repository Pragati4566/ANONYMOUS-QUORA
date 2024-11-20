const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const userDB = require("../models/User");
const tokenDB = require("../models/Token");
const sendEmail = require("../utils/SendEmail");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;

router.post("/register", async (req, res) => {
  try {
    if (req.body.confirmPassword != req.body.password) {
      return res.status(400).send({
        status: false,
        message: "Both the password must be same!",
      });
    }
    let user = await userDB.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({
        status: false,
        message: "Email already taken!",
      });
    }

    if (req.body.email.endsWith(".com")) {
      return res.status(400).send({
        status: false,
        message: "Please enter your institute email address!",
      });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    user = await userDB.create({
      name: req.body.name,
      email: req.body.email,
      collegeName: req.body.collegeName,
      password: encryptedPassword,
      votes: {},
    });

    const token = await tokenDB.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    const url = `${BASE_URL}/auth/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res.status(400).send({
      status: true,
      message:
        "An Email Verification Link has been sent to your account, please verify!",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while registration!",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userDB.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User does not exist!",
      });
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      if (!user.verified) {
        let token = await tokenDB.findOne({ userId: user._id });
        if (!token) {
          token = await tokenDB.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          });
        }

        const url = `${BASE_URL}/auth/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);

        return res.status(400).send({
          status: true,
          message:
            "An Email Verification Link has been sent to your account, please verify!",
        });
      } else {
        const loginToken = jwt.sign({ email: user.email }, JWT_SECRET, {
          expiresIn: "365d",
        });

        if (res.status(201)) {
          return res.status(200).send({
            status: true,
            message: "Logged in successfully!",
            data: loginToken,
          });
        } else {
          return res.status(400).send({
            status: false,
            message: "Error!",
          });
        }
      }
    }
    res.status(400).send({
      status: false,
      message: "Incorrect email or password!",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while signing in!",
    });
  }
});

router.post("/userData", async (req, res) => {
  try {
    const user = jwt.verify(req.body.token, JWT_SECRET, (err, res) => {
      if (err) return "token expired!";
      return res;
    });

    if (user == "token expired!") {
      return res.status(400).send({
        status: false,
        message: "token expired!",
      });
    }

    const userEmail = user.email;
    userDB
      .findOne({ email: userEmail })
      .then((data) => {
        res.status(200).send({
          status: true,
          message: "User data fetched!",
          data: data,
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
      message: "Error while getting user data!",
    });
  }
});

router.get("/:id/userData", async (req, res) => {
  try {
    userDB
      .findOne({ _id: req.params.id })
      .then((data) => {
        res.status(200).send({
          status: true,
          message: "User details fetched successfully!",
          data: data,
        });
      })
      .catch(() => {
        res.status(400).send({
          status: false,
          message: "User does not exist!",
        });
      });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error while getting user data!",
    });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await userDB.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ status: false, message: "Invalid Link" });

    const token = await tokenDB.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ status: false, message: "Invalid Link" });

    await userDB.updateOne({ _id: user._id }, { $set: { verified: true } });
    await tokenDB.deleteOne({ _id: token._id });

    res
      .status(200)
      .send({ status: true, message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const user = await userDB.findOne({ email: req.body.email });
    if (!user || !user.verified)
      return res
        .status(400)
        .send({ status: false, message: "User does not exist!" });

    let token = await tokenDB.findOne({ userId: user._id });
    if (!token) {
      token = await tokenDB.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
    }
    const url = `${BASE_URL}/${user._id}/reset-password/${token.token}`;
    await sendEmail(req.body.email, "Reset Password", url);
    res.status(400).send({
      status: true,
      message: "Password Reset Link has been sent to your email address!",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.get("/:id/verify-reset-password-link/:token", async (req, res) => {
  try {
    const user = await userDB.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ status: false, message: "Invalid Link" });

    const token = await tokenDB.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ status: false, message: "Invalid Link" });

    return res.status(200).send({ status: true, message: "Valid Link" });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

router.post("/:id/reset-password/:token", async (req, res) => {
  try {
    const user = await userDB.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ status: false, message: "Invalid Link" });

    const token = await tokenDB.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ status: false, message: "Invalid Link" });

    if (req.body.confirmPassword != req.body.password) {
      return res.status(400).send({
        status: false,
        message: "Both the password must be same!",
      });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    await userDB.updateOne(
      { _id: user._id },
      { $set: { password: encryptedPassword } }
    );

    await tokenDB.deleteOne({ _id: token._id });

    res
      .status(200)
      .send({ status: true, message: "Password Reset successfully!" });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unexpected error!",
    });
  }
});

module.exports = router;
