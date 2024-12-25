import jwt from "jsonwebtoken";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    user.otp = otp;
    user.otpExpires = Date.now() + 300000; // 5 minutes expiry
    await user.save();

    return res
      .status(200)
      .json({ message: "Enter Your OTP To Verify Your Email." });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// OTP Verification Controller
export const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    console.log("User found:", user); // Debugging line

    if (Date.now() > user.otpExpires || user.otp.toString() !== otp.toString()) {
      console.log("OTP validation failed:", {
        receivedOtp: otp,
        storedOtp: user.otp,
        expiresAt: user.otpExpires,
        currentTime: Date.now(),
      }); // Debugging line
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, generate JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

