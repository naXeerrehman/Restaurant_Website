import express from "express";
import dotenv from "dotenv";
import signUpRoutes from "./routes/authenticationRoutes/signUpRoutes.js";
import loginRoutes from "./routes/authenticationRoutes/loginRoutes.js";
import userCrudRoutes from "./routes/authenticationRoutes/userCrudRoutes.js";
import passwordRoutes from "./routes/authenticationRoutes/passwordRoutes.js";
import adminShipRoutes from "./routes/authenticationRoutes/adminShipRoutes.js";
import itemCrudRoutes from "./routes/itemCrudRoutes.js";
import menuCrudRoutes from "./routes/menuCrudRoutes.js";
import connectDB from "./db.js";
import corsMiddleware from "./MiddleWares/cors.js";
import socialIcon from "./routes/socialIconRoutes.js";
import contactForm from "./routes/contactForm.js";
import reviews from "./routes/reviewsRoutes.js";
import reservationWebsiteIcon from "./routes/reservationWebsiteIconRoutes.js";
import orderingWebsiteIconRoutes from "./routes/orderingWebsiteIconRoutes.js";
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

app.use("/api/admin", adminShipRoutes);

app.use("/api/items", itemCrudRoutes);

app.use("/api", socialIcon);

app.use("/api", reservationWebsiteIcon);

app.use("/api", orderingWebsiteIconRoutes);

app.use("/api/contacts", contactForm);

app.use("/api/reviews", reviews);

app.use("/api/menus", menuCrudRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server Is Running On Port ${PORT}`);
});
