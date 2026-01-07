const express = require("express");
const router = express.Router();

const {
  createRecipe,
  getApprovedRecipes,
  getMyRecipes,
  saveRecipe,
  toggleLike,
  updateMyRecipe,
  getRecipeById,
} = require("../controllers/recipeController");

const { getSavedRecipes } = require("../controllers/recipeController");
const {
  unsaveRecipe,
  deleteMyRecipe,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");
const { rejectRecipe } = require("../controllers/recipeController");

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
// router.get("/:id", protect, getSingleRecipe);


module.exports = router;
