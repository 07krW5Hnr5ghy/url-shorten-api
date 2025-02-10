const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  accessCount: { type: Number, default: 0 },
  accessLogs:[
    {
      ip: String,
      userAgent: String,
      timestamp: { type: Date, default: Date.now },
      country: String,
      city: String,
      isp: String
    },
  ]
});

module.exports = mongoose.model("Url", urlSchema);
