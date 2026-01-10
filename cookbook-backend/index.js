import express from "express";
import dotenv from "dotenv";
import cors from "cors";

/* DB */
import connectDB from "./config/db.js";

/* Routes */
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

/* middlewares */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cookbook-new.vercel.app",
    ], // same-domain frontend (Vercel)
    credentials: true,
  })
);

app.use(express.json());

/* DB connect */
connectDB();

/* routes */
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

/* test route */
app.get("/api/test", (req, res) => {
  res.json({ message: "Cookbook backend live on Vercel 🚀" });
});

/* ❌ app.listen MAT LIKHNA */

/* ✅ MOST IMPORTANT */
export default app;
