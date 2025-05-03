import User from "../../models/user.js"; // Assume admins are part of the User model with an "isAdmin" flag
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
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

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be 8 characters or more." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // Save temporary data in memory (not the database)
    tempOtpStore[email] = {
      otp,
      expires: otpExpiry,
      hashedPassword,
      name,
    };

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);

    res.status(200).json({ message: "Registration initiated. OTP sent!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error during registration process." });
  }
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

    if (otp !== otpData.otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const { hashedPassword, name } = otpData;

    // Save the verified user to the database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    // Clean up temporary OTP data
    delete tempOtpStore[email];

    // Notify all admins about the new registration
    notifyAdmins(newUser);

    // Generate JWT for the user
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "OTP verified successfully. You are now fully registered!",
      token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};
