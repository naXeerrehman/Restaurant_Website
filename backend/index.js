import express from "express";
import dotenv from "dotenv";
import signUpRoutes from "./routes/signUpRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import userCrudRoutes from "./routes/userCrudRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./db.js";
import corsMiddleware from "./MiddleWares/cors.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// Google sign up
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Middleware
corsMiddleware(app);
connectDB();

// routes for registering users
app.use("/api/users", signUpRoutes);

// user login route
app.use("/api/auth", loginRoutes);

// Use UserManagementRouter
app.use("/api", userCrudRoutes); // You can prefix your routes with /api or any other base path

// Use the password routes
app.use("/api/auth", passwordRoutes);

app.use("/api/admin", adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server Is Running On Port ${PORT}`);
});
