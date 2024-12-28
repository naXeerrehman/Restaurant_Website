import express from "express";
import {
  verifyAdmin,
  getRegisteredUsers,
} from "../controllers/adminShip.js";

const router = express.Router();

// Route to get all registered users, accessible only by admins
router.get("/registered-users", verifyAdmin, getRegisteredUsers);

export default router;
