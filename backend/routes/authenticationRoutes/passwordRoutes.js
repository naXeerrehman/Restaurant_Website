import express from "express";
import {
  resetPassword,
  newPassword,
} from "../../controllers/authenticationControllers/password.js";

const router = express.Router();

// Route to request password reset
router.post("/reset-password", resetPassword);

// Route to update the new password
router.post("/new-password/:token", newPassword);

export default router;
