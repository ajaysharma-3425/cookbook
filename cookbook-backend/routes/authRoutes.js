const express = require("express");
const router = express.Router();
const { signup, login, getMyProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMyProfile);

module.exports = router;