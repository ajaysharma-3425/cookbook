const User = require("../models/User");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user FIRST
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Create token AFTER user exists
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send response
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("savedRecipes", "title image");

    const myRecipes = await Recipe.find({ createdBy: userId });

    const stats = {
      totalRecipes: myRecipes.length,
      approved: myRecipes.filter(r => r.status === "approved").length,
      pending: myRecipes.filter(r => r.status === "pending").length,
      rejected: myRecipes.filter(r => r.status === "rejected").length,
      totalLikes: myRecipes.reduce((sum, r) => sum + r.likes.length, 0),
      savedCount: user.savedRecipes.length,
    };

    res.json({
      user,
      stats,
      myRecipes,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile fetch failed" });
  }
};