const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");
const router = require("./routes");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

//database connection
db.connect();


//middle-ware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //any frontend can call this server
  req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");//this info is accepted from the frontend
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");//server will accept these methods only
  next();
});
app.use("/api/report", require("./routes/report.routes"));

app.use(cors());

//routes
app.use("/api", router);
    

app.listen(PORT, () => {
  console.log(`Listening on port no ${PORT}`);
});
