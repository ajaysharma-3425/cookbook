const express = require("express");
const router = express.Router();
const {
  getPendingRecipes,
  updateRecipeStatus,
  rejectRecipe,
} = require("../controllers/recipeController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { getAdminDashboardStats } = require("../controllers/adminController");

router.get("/recipes/pending", protect, isAdmin, getPendingRecipes);
router.put("/recipes/:id", protect, isAdmin, updateRecipeStatus);
router.put("/recipes/reject/:id", protect, isAdmin, rejectRecipe);
router.get("/dashboard",protect,isAdmin,getAdminDashboardStats)
module.exports = router;
