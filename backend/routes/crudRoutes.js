import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  toggleAdminStatus,
  removeAdmin,
} from "../controllers/crudController.js";
// import { authenticate } from '../middleware/authenticate.js'; // Ensure you have an authentication middleware

const router = express.Router();

// Routes
router.get("/users", getAllUsers); // Fetch all users
router.put("/users/:userId", updateUser); // Update user
router.delete("/users/:userId", deleteUser); // Delete user
router.patch("/users/toggle-admin", toggleAdminStatus); // Toggle admin status
router.post("/users/remove-admin", removeAdmin); // Remove admin status

export default router;
