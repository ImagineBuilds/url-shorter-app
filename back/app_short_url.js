require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/", express.static(path.resolve("./front"))); // serve main path as static dir
app.get("/", function (req, res) {
  // serve main path as static file
  res.sendFile(path.resolve("./front/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

app.use(errorHandler);
module.exports = app;
