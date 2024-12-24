import User from "../models/user.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

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

// Temporary in-memory store for OTPs
let tempOtpStore = {}; // This will store OTPs temporarily

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate request body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if OTP already exists for this email (if user already requested OTP)
    if (tempOtpStore[email]) {
      return res
        .status(400)
        .json({ message: "OTP already sent. Please verify it." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999); // Generates a random 6-digit OTP

    // Store the OTP temporarily in memory (or use a more persistent store if needed)
    tempOtpStore[email] = {
      otp,
      hashedPassword,
      name,
      expires: Date.now() + 3600000,
    }; // OTP expires in 1 hour

    // Send OTP email
    await sendOTP(email, otp);

    return res.status(201).json({
      message:
        "OTP has been sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Generate and send OTP
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body; // 'name' is already stored in tempOtpStore

  try {
    // Check if the OTP exists for the provided email
    const otpData = tempOtpStore[email];
    console.log(`OTP Data for ${email}:`, otpData); // Debugging line to print OTP data

    if (!otpData) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }

    // Check if OTP is expired
    const isExpired = Date.now() > otpData.expires;
    console.log(
      `OTP expiration check for ${email}: ${isExpired ? "Expired" : "Valid"}`
    ); // Debugging line
    if (isExpired) {
      // Clear OTP after expiry
      delete tempOtpStore[email]; // Remove the OTP data after expiry
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    // Ensure OTP is in the same format (string) for comparison
    const receivedOtp = otp.toString(); // Ensure the received OTP is a string
    const storedOtp = otpData.otp.toString(); // Ensure the stored OTP is a string

    console.log(`Comparing OTP: ${receivedOtp} with stored OTP: ${storedOtp}`); // Debugging line

    // Verify OTP
    if (receivedOtp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is valid and not expired, proceed with user registration
    const { hashedPassword, name } = otpData;

    // Create the user in the database
    const newUser = new User({
      name: name, // Include the 'name' field from OTP data
      email: email,
      password: hashedPassword, // Store the hashed password
      isVerified: true, // Set user as verified
    });

    // Save the user in the database
    await newUser.save();

    // Clear the OTP data after successful registration
    delete tempOtpStore[email];

    return res.status(200).json({
      message: "OTP verified successfully. You are now fully registered!",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      // If the user already exists, respond with a message
      return res
        .status(409)
        .json({ message: "User already exists. Please log in." });
    }

    // If not, create a new user
    user = new User({
      name,
      email,
      isVerified: true, // Mark Google users as verified
    });

    // Save the new user
    await user.save();

    return res.status(201).json({ message: "Google sign-up successful", user });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
