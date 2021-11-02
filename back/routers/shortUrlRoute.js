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
router.get("/:?id", (req, res, next) => {});

/**
 * * Sends back shorter URL
 */
router.get("/", (req, res, next) => {});

module.exports = router;
