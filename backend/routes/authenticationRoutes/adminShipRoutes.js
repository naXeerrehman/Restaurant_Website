import express from "express";
import {
  toggleAdminStatus,
  removeAdmin,
} from "../../controllers/authenticationControllers/adminShip.js";

const router = express.Router();

// Route to get all registered users, accessible only by admins
router.patch("/users/toggle-admin", toggleAdminStatus); // Toggle admin status
router.post("/users/remove-admin", removeAdmin); // Remove admin status

export default router;
