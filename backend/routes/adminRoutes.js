import express from "express";
import {
  verifyAdmin,
  getRegisteredUsers,
  authorizeUser,
} from "../controllers/adminController.js";

const router = express.Router();

// Route to get all registered users, accessible only by admins
router.get("/registered-users", verifyAdmin, getRegisteredUsers);

// Route to authorize a user, accessible only by admins
router.post("/authorize-user", verifyAdmin, authorizeUser);

export default router;
