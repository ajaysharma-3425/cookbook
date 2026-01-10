import express from "express";
const router = express.Router();

import {
  createRecipe,
  getApprovedRecipes,
  getMyRecipes,
  saveRecipe,
  toggleLike,
  updateMyRecipe,
  getRecipeById,
  getSavedRecipes,
  unsaveRecipe,
  deleteMyRecipe,
  rejectRecipe,
} from "../controllers/recipeController.js";

import { protect } from "../middleware/authMiddleware.js";

/* User recipes */
router.put("/reject/:id", protect, rejectRecipe);
router.post("/", protect, createRecipe);
router.get("/", getApprovedRecipes);
router.get("/my", protect, getMyRecipes);
router.post("/:id/save", protect, saveRecipe);
router.post("/:id/like", protect, toggleLike);
router.get("/saved", protect, getSavedRecipes);
router.delete("/:id/save", protect, unsaveRecipe);
router.delete("/:id", protect, deleteMyRecipe);
router.get("/:id", protect, getRecipeById);
router.put("/:id", protect, updateMyRecipe);

export default router;
