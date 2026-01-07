const Recipe = require("../models/Recipe");
const User = require("../models/User");
const Notification = require("../models/Notification")

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
