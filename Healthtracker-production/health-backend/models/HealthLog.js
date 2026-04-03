const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  bp: String,
  sugar: String,
  heartRate: String,
  symptoms: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HealthLog", healthSchema);
