import User from "../../models/user.js";
import nodemailer from "nodemailer";

// Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users); // Send back the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const { email, name } = req.body;
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    if (decoded.isAdmin) {
      req.user = decoded; // Attach the decoded token to the request
      next(); // Proceed to the next middleware/route handler
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Example of an admin-only controller
export const getRegisteredUsers = async (req, res) => {
  try {
    const users = await User.find(); // Assuming you have a User model
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

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
