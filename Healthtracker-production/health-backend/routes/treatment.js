const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  addTreatment,
  getTreatments,
  getTreatmentById,
  deleteTreatment
} = require("../controllers/treatmentController");

router.post("/", auth, addTreatment);
router.get("/", auth, getTreatments);
router.delete("/:id", auth, deleteTreatment);
router.get("/:id", auth, getTreatmentById);


module.exports = router;
