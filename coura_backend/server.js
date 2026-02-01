const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");
const router = require("./routes");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();
const PORT = process.env.PORT || 5000;

db.connect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: false,
    message: "Too many requests, please try again later",
  },
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", limiter);//Jo bhi request /api se start hogi, usse pehle limiter chalega


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

app.use(cors());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Listening on port no ${PORT}`);
});
