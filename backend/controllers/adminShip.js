import User from "../models/user.js"; // Assuming you have a user model
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
