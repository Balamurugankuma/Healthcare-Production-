const router = require("express").Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile,} = require("../controllers/profileController");
const { changePassword } = require("../controllers/profileController");
const upload = require("../middleware/upload");
const { uploadAvatar } = require("../controllers/profileController");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);
module.exports = router;
