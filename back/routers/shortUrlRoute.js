const express = require("express");
const router = express.Router();
const DataBase = require("../database");
const DB = new DataBase();

/**
 * *This route routes to:
 * ? /api/shorturl/
 */

/**
 * * Opens the right page
 */
router.get("/:urlid", (req, res, next) => {
  try {
    let urlInfo = DataBase.getInfo(req.params.urlid);
    if (urlInfo.error === undefined) {
      DataBase.urlRedirectEntry(req.params.urlid);
      return res.redirect(urlInfo.originalUrl);
    } else {
      throw urlInfo;
    }
  } catch (error) {
    next(error);
  }
});

/**
 *  * Generate new url short
 */
router.get("/info/:urlid", (req, res, next) => {
  try {
    let urlInfo = DataBase.getInfo(req.params.urlid);
    if (urlInfo.error === undefined) {
      res.json(urlInfo);
    } else {
      throw urlInfo;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * * Sends back shorter URL
 */
router.get("/", (req, res, next) => {});

module.exports = router;
