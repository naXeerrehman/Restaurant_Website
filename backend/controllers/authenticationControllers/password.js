import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // Make sure to install this if not already
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /reset-password
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Send password reset email with clickable link to the correct route
    const resetUrl = `${process.env.FRONTEND_URL}/NewPassword/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Hi ${user.email},</p>
             <p>Please click the following link to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a>
             <p>This link is valid for 15 minutes.</p>
             <p>Best regards,<br>Hinckley Beanery</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Reset the user's password
export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const user = await User.findById(decoded.id); // Find the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password before saving it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10; // You can adjust the salt rounds as needed
  return await bcrypt.hash(password, saltRounds);
};
