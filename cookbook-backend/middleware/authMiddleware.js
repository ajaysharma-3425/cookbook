import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id, role }

    // 🔥 USER FETCH (SAFE)
    const user = await User.findById(decoded.id).select("name role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 BACKWARD COMPATIBLE
    req.user = {
      ...decoded,      // keeps id, role
      name: user.name, // adds name safely
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
