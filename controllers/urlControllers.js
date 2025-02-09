const Url = require("../models/urlModel");
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const {isMaliciousUrl} = require("../util/util");

// Create Short URL
exports.createShortUrl = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  if (await isMaliciousUrl(url)) {
    return res.status(400).json({ error: 'Malicious URL detected' });
  }
 
  try {
    const shortCode = nanoid(6);
    const existing = await ShortUrl.findOne({ originalUrl: url });

    if (existing) {
      return res.status(200).json(existing);
    }

    const newUrl = new Url({ originalUrl: url, shortCode });
    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Retrieve Original URL
exports.getOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlData = await Url.findOne({ shortCode });

    if (!urlData) return res.status(404).json({ error: "URL not found" });

    urlData.accessCount += 1;
    urlData.accessLogs.push({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
    });

    await urlData.save();

    res.redirect(urlData.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update URL
exports.updateShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { url } = req.body;

    const updatedUrl = await Url.findOneAndUpdate(
      { shortCode },
      { originalUrl: url, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedUrl) return res.status(404).json({ error: "URL not found" });

    res.json(updatedUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Short URL
exports.deleteShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const deletedUrl = await Url.findOneAndDelete({ shortCode });

    if (!deletedUrl) return res.status(404).json({ error: "URL not found" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Statistics
exports.getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlData = await Url.findOne({ shortCode });

    if (!urlData) return res.status(404).json({ error: "URL not found" });

    res.json({
      accessCount:urlData.accessCount,
      accessLogs:urlData.accessLogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
