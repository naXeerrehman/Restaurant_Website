import express from "express";
import {
  registerUser,
  verifyOtp,
  googleSignUp,
} from "../controllers/signUpController.js"; // Adjust import path as needed

const router = express.Router();

// POST request to register a new user
router.post("/register", registerUser);
// Route for verifying OTP
router.post("/verify-otp", verifyOtp);

router.post("/google-signup", googleSignUp);

export default router;
