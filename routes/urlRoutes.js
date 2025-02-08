const express = require("express");
const {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  deleteShortUrl,
  getUrlStats,
} = require("../controllers/urlControllers");

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/shorten/:shortCode", getOriginalUrl);
router.put("/shorten/:shortCode", updateShortUrl);
router.delete("/shorten/:shortCode", deleteShortUrl);
router.get("/shorten/:shortCode/stats", getUrlStats);

module.exports = router;
