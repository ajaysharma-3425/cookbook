const Recipe = require("../models/Recipe");
const User = require("../models/User");
const Notification = require("../models/Notification")

// ADMIN: add new recipe
exports.createRecipeAdmin = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      image,
      cookingTime,
      status
    } = req.body;

    // 🔴 VALIDATION
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
      image: image || "", // 👈 allow base64 for now
      cookingTime,
      status: status || "approved",
      createdBy: req.user.id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};



exports.getAdminDashboardStats = async (req, res) => {
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

            // 🔥 ROW 4 DATA
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
            users: {
                total: totalUsers,
                creators,
            },
            activity: recentActivity,
        });
    } catch (error) {
        console.error("ADMIN DASHBOARD ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ADMIN: get all recipes (with filters)
exports.getAllRecipesAdmin = async (req, res) => {
  try {
    const { status } = req.query; // optional filter

    const filter = {};
    if (status) filter.status = status;

    const recipes = await Recipe.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error("ADMIN GET RECIPES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: update recipe (edit)
// UPDATE recipe (admin)
exports.updateRecipeAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.title = req.body.title;
    recipe.description = req.body.description;
    recipe.cookingTime = req.body.time || req.body.cookingTime; // ye check karo
    recipe.status = req.body.status;
    recipe.steps = req.body.steps;
    recipe.ingredients = req.body.ingredients;

    await recipe.save();

    res.json({ message: "Recipe updated successfully", recipe });
  } catch (error) {
    console.error("ADMIN UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ADMIN: delete recipe
exports.deleteRecipeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Get Single Recipe Admin
exports.getRecipeByIdAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe)
      return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};