const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conditionName: { type: String, required: true },
    doctorName: String,
    visitDate: { type: String, required: true },
    nextVisitDate: String,
    notes: String,
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
