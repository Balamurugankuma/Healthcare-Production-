const router = require("express").Router();
const auth = require("../middleware/auth");
const { checkHealth } = require("../controllers/aiController");

router.post("/check", auth, checkHealth);

module.exports = router;
