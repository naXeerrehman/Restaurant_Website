import express from "express";
import {
  registerUser,
  verifyOtp,
} from "../../controllers/authenticationControllers/signUp.js";

const router = express.Router();

// POST request to register a new user
router.post("/register", registerUser);
// Route for verifying OTP
router.post("/verify-otp", verifyOtp);

export default router;
