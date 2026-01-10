const express = require("express");
const router = express.Router();
const { signup, login, getMyProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMyProfile);

module.exports = router;