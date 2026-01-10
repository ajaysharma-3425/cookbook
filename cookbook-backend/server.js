// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");

// /* routes */
// const authRoutes = require("./routes/authRoutes");
// const recipeRoutes = require("./routes/recipeRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");

// dotenv.config();

// /* db connect */
// connectDB();

// const app = express();

// /* middlewares */
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://cookbook-new.vercel.app",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json());

// /* routes */
// app.use("/api/auth", authRoutes);
// app.use("/api/recipes", recipeRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/notifications", notificationRoutes);

// /* test */
// app.get("/", (req, res) => {
//   res.send("Cookbook API running on Vercel 🚀");
// });

// /* ❌ PORT / listen NAHI */
// /* ✅ CommonJS export *
// module.exports = app;
