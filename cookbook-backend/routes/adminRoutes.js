import express from "express";
const router = express.Router();

import {
  getPendingRecipes,
  updateRecipeStatus,
  rejectRecipe,
} from "../controllers/recipeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import {
  getAdminDashboardStats,
  getAllRecipesAdmin,
  updateRecipeAdmin,
  deleteRecipeAdmin,
  getRecipeByIdAdmin,
  createRecipeAdmin,
} from "../controllers/adminController.js";

/* Admin recipe moderation */
router.get("/recipes/pending", protect, isAdmin, getPendingRecipes);
router.put("/recipes/status/:id", protect, isAdmin, updateRecipeStatus);
router.put("/recipes/reject/:id", protect, isAdmin, rejectRecipe);

/* Dashboard */
router.get("/dashboard", protect, isAdmin, getAdminDashboardStats);

/* Admin CRUD */
router.get("/recipes", protect, isAdmin, getAllRecipesAdmin);
router.get("/recipes/:id", protect, isAdmin, getRecipeByIdAdmin);
router.post("/recipes", protect, isAdmin, createRecipeAdmin);
router.put("/recipes/:id", protect, isAdmin, updateRecipeAdmin);
router.delete("/recipes/:id", protect, isAdmin, deleteRecipeAdmin);

export default router;
