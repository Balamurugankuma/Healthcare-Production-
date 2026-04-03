const router = require("express").Router();
const auth = require("../middleware/auth");
const {addLog,getLogs,updateLog,deleteLog,} = require("../controllers/healthController");

router.post("/",auth,addLog);
router.get("/",auth,getLogs);
router.put("/:id", auth, updateLog);     
router.delete("/:id", auth, deleteLog); 

module.exports = router;
