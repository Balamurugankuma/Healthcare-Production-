const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  addMedicine,
  getMedicinesByTreatment,
  getDueReminders,
  markDoseTaken,
  deleteMedicine
} = require("../controllers/medicineController");
router.get("/reminders/due", auth, getDueReminders);
router.post("/:treatmentId", auth, addMedicine);
router.get("/:treatmentId", auth, getMedicinesByTreatment);
router.post("/take/:medicineId/:doseIndex", auth, markDoseTaken);
router.delete("/delete/:id", auth, deleteMedicine);



module.exports = router;
