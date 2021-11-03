require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const shortUrlRouter = require("./routers/shortUrlRoute");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", express.static(path.resolve("./front"))); // serve main path as static dir
app.get("/", function (req, res) {
  // serve main path as static file
  res.sendFile(path.resolve("./front/index.html"));
});

app.use("/api/shorturl/", shortUrlRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
module.exports = app;
