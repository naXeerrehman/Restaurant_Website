import User from "../models/user.js"; // Assume admins are part of the User model with an "isAdmin" flag
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken"; // Import jwt

// Load environment variables
dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

// Temporary in-memory store for OTPs
let tempOtpStore = {}; // This will store OTPs temporarily

// Function to send a notification email to all admins
const notifyAdmins = async (newUser) => {
  try {
    // Fetch all admins dynamically from the database
    const admins = await User.find({ isAdmin: true }); // Query all users with the admin role

    if (admins.length === 0) {
      console.warn("No admins found to notify.");
      return;
    }

    // Prepare email addresses of all admins
    const adminEmails = admins.map((admin) => admin.email);

    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email
      to: adminEmails, // Array of admin emails
      subject: "New User Registered",
      text: `A new user has registered.\n\nName: ${newUser.name}\nEmail: ${newUser.email}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admins notified of new user registration");
  } catch (error) {
    console.error("Error notifying admins:", error);
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already registered. Please log in." });
    }

    if (tempOtpStore[email]) {
      return res
        .status(400)
        .json({ message: "OTP already sent. Please verify it." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999);

    tempOtpStore[email] = {
      otp,
      hashedPassword,
      name,
      expires: Date.now() + 3600000,
    };

    await sendOTP(email, otp);

    return res.status(201).json({
      message: "Please enter OTP to verify your email",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Generate and send OTP
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpData = tempOtpStore[email];
    if (!otpData) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }

    const isExpired = Date.now() > otpData.expires;
    if (isExpired) {
      delete tempOtpStore[email];
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    const receivedOtp = otp.toString();
    const storedOtp = otpData.otp.toString();

    if (receivedOtp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const { hashedPassword, name } = otpData;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();
    delete tempOtpStore[email];

    // Notify all admins dynamically
    notifyAdmins(newUser);

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "OTP verified successfully. You are now fully registered!",
      token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleSignUp = async (req, res) => {
  const { token } = req.body; // The token from the frontend

  try {
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify the token using Google's API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is set correctly
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      // If the user already exists, respond with the new message
      return res
        .status(409)
        .json({ message: "User already registered. Please log in." });
    }

    // If not, create a new user
    user = new User({
      name,
      email,
      isVerified: true, // Mark Google users as verified
    });

    // Save the new user
    await user.save();

    // Generate and send JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Google sign-up successful",
      user,
      token, // Send the token in the response
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
