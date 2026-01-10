const express = require("express");
const router = express.Router();
const {
  getPendingRecipes,
  updateRecipeStatus,
  rejectRecipe,
} = require("../controllers/recipeController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { getAdminDashboardStats, getAllRecipesAdmin, updateRecipeAdmin, deleteRecipeAdmin, getRecipeByIdAdmin, createRecipeAdmin } 
= require("../controllers/adminController");

const {
  getAllUsersAdmin,
  getUserByIdAdmin,
  updateUserAdmin,
  deleteUserAdmin
} = require("../controllers/adminController");

router.get("/users", protect, isAdmin, getAllUsersAdmin);
router.get("/users/:id", protect, isAdmin, getUserByIdAdmin);
router.put("/users/:id", protect, isAdmin, updateUserAdmin);
router.delete("/users/:id", protect, isAdmin, deleteUserAdmin);


router.get("/recipes/pending", protect, isAdmin, getPendingRecipes);
router.put("/recipes/status/:id", protect, isAdmin, updateRecipeStatus);
router.put("/recipes/reject/:id", protect, isAdmin, rejectRecipe);
router.get("/dashboard", protect, isAdmin, getAdminDashboardStats)

router.get("/recipes", protect, isAdmin, getAllRecipesAdmin);
router.get("/recipes/:id", protect, isAdmin, getRecipeByIdAdmin);
router.post("/recipes", protect, isAdmin, createRecipeAdmin);
router.put("/recipes/:id", protect, isAdmin, updateRecipeAdmin);
router.delete("/recipes/:id", protect, isAdmin, deleteRecipeAdmin);
module.exports = router;