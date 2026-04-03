const Treatment = require("../models/Treatment");

// Add treatment
exports.addTreatment = async (req, res) => {
  const treatment = await Treatment.create({
    ...req.body,
    userId: req.userId,
  });
  res.json(treatment);
};

// Get all treatments
exports.getTreatments = async (req, res) => {
  const treatments = await Treatment.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(treatments);
};

exports.deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    await treatment.deleteOne();

    res.json({ message: "Treatment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete treatment" });
  }
};

exports.getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
