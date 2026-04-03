const mongoose = require("mongoose");

const DoseSchema = new mongoose.Schema({
  time: {
    type: String, // "08:00"
    required: true
  },
  lastTakenAt: {
    type: Date,
    default: null
  }
});

const MedicineSchema = new mongoose.Schema({
  treatmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Treatment",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  dosage: {
    type: String,
    required: true
  },

  timesPerDay: {
    type: Number,
    required: true
  },

  doses: {
    type: [DoseSchema],
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Medicine", MedicineSchema);


