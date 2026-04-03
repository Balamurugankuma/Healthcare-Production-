const Health = require("../models/HealthLog");

exports.addLog = async (req, res) => {
  try {
    const log = await Health.create({ ...req.body, userId: req.userId });
    res.status(201).json(log);
  } catch (err) {
    console.error("ADD LOG ERROR:", err.message);
    res.status(500).json({ message: "Failed to add health log." });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await Health.find({ userId: req.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch health logs." });
  }
};

exports.updateLog = async (req, res) => {
  try {
    const log = await Health.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ message: "Health log not found." });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: "Failed to update health log." });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const log = await Health.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!log) return res.status(404).json({ message: "Health log not found." });
    res.json({ message: "Health log deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete health log." });
  }
};
