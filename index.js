import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();
import userRoutes from "./routes/user.route.js";

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
