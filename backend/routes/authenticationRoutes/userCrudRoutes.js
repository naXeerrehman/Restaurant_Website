import express from "express";
import {
  verifyAdmin,
  getRegisteredUsers,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../controllers/authenticationControllers/userCrud.js";
// import { authenticate } from '../middleware/authenticate.js'; // Ensure you have an authentication middleware

const router = express.Router();

// Routes
router.get("/registered-users", verifyAdmin, getRegisteredUsers);
router.get("/users", getAllUsers); // Fetch all users
router.put("/users/:userId", updateUser); // Update user
router.delete("/users/:userId", deleteUser); // Delete user

export default router;
