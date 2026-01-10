const Recipe = require("../models/Recipe");
const Notification = require("../models/Notification");
const User = require("../models/User");
const mongoose = require("mongoose");



exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, image, cookingTime } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      image,
      createdBy: new mongoose.Types.ObjectId(req.user.id),
      cookingTime,
    });

    const admins = await User.find({ role: "admin" });

    for (let admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "New Recipe Submitted!",
        message: `${recipe.title} submitted by user`,
        link: "/admin/pending",
        type: "admin",
      });
    }

    res.status(201).json({
      message: "Recipe submitted successfully. Approval within 24 hours.",
      recipeId: recipe._id,
      status: recipe.status,
    });
    // console.log("USER:", req.user);
    // console.log("BODY:", req.body);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: get all pending recipes
exports.getPendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: "pending" }).populate(
      "createdBy",
      "name email"
    );
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: approve or reject recipe
exports.updateRecipeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Notification for user 

    await Notification.create({
      user: recipe.createdBy,
      title: "Recipe Approved 🎉",
      message: `Your recipe "${recipe.title}" has been approved`,
      link: `/recipe/${recipe._id}`,
      type: "recipe",
    });


    // ✅ APPROVE HERE
    recipe.status = "approved";
    await recipe.save();

    res.json({ message: "Recipe approved successfully", recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: approved recipes
exports.getApprovedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: "approved" })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User: my submitted recipes
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.saveRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedRecipes.some(
      (id) => id.toString() === recipeId
    );

    if (alreadySaved) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe saved successfully" });
    if (recipe.createdBy._id.toString() !== req.user.id) {
      await Notification.create({
        user: recipe.createdBy._id,
        title: "Recipe Saved 📌",
        message: `${req.user.name} saved your recipe "${recipe.title}"`,
        link: `/recipe/${recipe._id}`,
      });
    }

  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.toggleLike = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const index = recipe.likes.indexOf(req.user.id);

    if (index === -1) {
      recipe.likes.push(req.user.id);
      await recipe.save();

      // 🔔 notify ONLY on LIKE
      if (recipe.createdBy.toString() !== req.user.id) {
        await Notification.create({
          user: recipe.createdBy,
          title: "Recipe Liked ❤️",
          message: `${req.user.name} liked your recipe "${recipe.title}"`,
          link: `/recipe/${recipe._id}`,
          type: "like",
        });
      }

      return res.json({
        message: "Recipe liked",
        likesCount: recipe.likes.length,
      });
    }

    // 👇 UNLIKE (NO notification)
    recipe.likes.splice(index, 1);
    await recipe.save();

    res.json({
      message: "Recipe unliked",
      likesCount: recipe.likes.length,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// User: get saved recipes
exports.getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedRecipes",
      match: { status: "approved" },
      populate: {
        path: "createdBy",
        select: "name",
      },
    });

    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.unsaveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.savedRecipes = user.savedRecipes.filter(
      (recipeId) => recipeId.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "Recipe removed from saved list" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteMyRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  // only owner can delete
  const userId = req.user.id || req.user._id;

  if (recipe.createdBy.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized" });
  }


  // ❗ important: only rejected allowed
  if (!["rejected", "pending"].includes(recipe.status)) {
    return res.status(400).json({
      message: "Only pending or rejected recipes can be deleted",
    });
  }


  await recipe.deleteOne();
  res.json({ message: "Rejected recipe deleted" });
};


exports.rejectRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // ✅ admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ✅ createdBy safety check
    if (!recipe.createdBy) {
      return res.status(400).json({
        message: "Recipe owner missing",
      });
    }

    // ✅ update recipe first
    recipe.status = "rejected";
    recipe.rejectionReason = reason || "Not specified";
    await recipe.save();

    // ✅ then notification
    await Notification.create({
      user: recipe.createdBy,
      title: "Recipe Rejected ❌",
      message: `Your recipe "${recipe.title}" was rejected`,
      link: "/my-recipes",
      type: "recipe",
    });

    res.json({ message: "Recipe rejected successfully" });

  } catch (error) {
    console.error("REJECT ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateMyRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, steps } = req.body;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ownership check
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // status check
    if (recipe.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending recipes can be edited" });
    }

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = ingredients;
    if (steps) recipe.steps = steps;


    await recipe.save();

    res.json({ message: "Recipe updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET single recipe (owner only)
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "name");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 🔥 IMPORTANT RULE
    // If recipe is approved → anyone can see
    if (recipe.status !== "approved") {
      // only owner can see pending / rejected
      if (!req.user || recipe.createdBy._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
