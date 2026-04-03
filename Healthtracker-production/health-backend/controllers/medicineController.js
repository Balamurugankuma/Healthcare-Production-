const Medicine = require("../models/Medicine");

/**
 * ➕ Add medicine (WITH DOSES)
 */
exports.addMedicine = async (req, res) => {
  try {
    const {
      name,
      dosage,
      timesPerDay,
      doses,
      startDate,
      durationDays
    } = req.body;

    if (!name || !dosage || !timesPerDay || !doses?.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    const medicine = await Medicine.create({
      treatmentId: req.params.treatmentId,
      userId: req.userId,
      name,
      dosage,
      timesPerDay,
      doses,
      startDate,
      endDate
    });

    res.json(medicine);
  } catch (err) {
    console.error("ADD MEDICINE ERROR:", err);
    res.status(500).json({ message: "Failed to add medicine" });
  }
};


/**
 * 📄 Get medicines by treatment
 */
exports.getMedicinesByTreatment = async (req, res) => {
  try {
    const meds = await Medicine.find({
      treatmentId: req.params.treatmentId,
      userId: req.userId
    });

    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch medicines" });
  }
};

/**
 * 🕒 Mark a SINGLE DOSE as taken
 */
exports.markDoseTaken = async (req, res) => {
  try {
    const { medicineId, doseIndex } = req.params;

    const medicine = await Medicine.findOne({
      _id: medicineId,
      userId: req.userId
    });

    if (!medicine || !medicine.doses[doseIndex]) {
      return res.status(404).json({ message: "Dose not found" });
    }

    medicine.doses[doseIndex].lastTakenAt = new Date();
    await medicine.save();

    res.json(medicine); // ✅ return updated medicine
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark dose taken" });
  }
};

/**
 * ❌ Delete medicine
 */
exports.deleteMedicine = async (req, res) => {
  try {
    const deleted = await Medicine.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete medicine" });
  }
};

/**
 * 🔔 Get due dose reminders (PER DOSE)
 */
exports.getDueReminders = async (req, res) => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toDateString();

    console.log("⏰ Checking reminders at:", currentTime);

    const medicines = await Medicine.find({
      userId: req.userId,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    const due = [];

    medicines.forEach(med => {
      if (!med.doses) return;

      med.doses.forEach((dose, index) => {
        const takenToday =
          dose.lastTakenAt &&
          new Date(dose.lastTakenAt).toDateString() === today;

        if (dose.time === currentTime && !takenToday) {
          due.push({
            medicineId: med._id,
            medicineName: med.name,
            dosage: med.dosage,
            doseIndex: index,
            time: dose.time
          });
        }
      });
    });

    console.log("🔔 Due reminders:", due);
    res.json(due);
  } catch (err) {
    console.error("REMINDER ERROR:", err);
    res.status(500).json({ message: "Failed to get reminders" });
  }
};
