import express from "express";
import {
  loginUser,
  verifyLoginOtp,
} from "../../controllers/authenticationControllers/login.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOtp);

export default router;
