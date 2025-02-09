const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  accessCount: { type: Number, default: 0 },
  accessLogs:[
    {
      ip:String,
      userAgent:String,
      timeStamp:{type:Date,default:Date.now}
    }
  ]
});

module.exports = mongoose.model("Url", urlSchema);
