import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// ADMIN: add new recipe
export const createRecipeAdmin = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      image,
      cookingTime,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !ingredients?.length ||
      !steps?.length ||
      !cookingTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      image: image || "",
      cookingTime,
      status: status || "approved",
      createdBy: req.user.id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalRecipes,
      approvedRecipes,
      pendingRecipes,
      rejectedRecipes,
      totalUsers,
      creators,
      recentActivity,
    ] = await Promise.all([
      Recipe.countDocuments(),
      Recipe.countDocuments({ status: "approved" }),
      Recipe.countDocuments({ status: "pending" }),
      Recipe.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "user" }),
      Recipe.distinct("createdBy").then((ids) => ids.length),
      Notification.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title message createdAt"),
    ]);

    res.json({
      recipes: {
        total: totalRecipes,
        approved: approvedRecipes,
        pending: pendingRecipes,
        rejected: rejectedRecipes,
      },
      users: { total: totalUsers, creators },
      activity: recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllRecipesAdmin = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const recipes = await Recipe.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRecipeAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.title = req.body.title;
    recipe.description = req.body.description;
    recipe.cookingTime = req.body.time || req.body.cookingTime;
    recipe.status = req.body.status;
    recipe.steps = req.body.steps;
    recipe.ingredients = req.body.ingredients;

    await recipe.save();
    res.json({ message: "Recipe updated successfully", recipe });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRecipeAdmin = async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe)
    return res.status(404).json({ message: "Recipe not found" });

  res.json({ message: "Recipe deleted successfully" });
};

export const getRecipeByIdAdmin = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).json({ message: "Recipe not found" });

  res.json(recipe);
};
