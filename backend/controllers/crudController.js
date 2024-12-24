import User from "../models/user.js";

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

// Toggle admin status
export const toggleAdminStatus = async (req, res) => {
  const { userId } = req.body; // User ID passed in request body
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isAdmin = !user.isAdmin; // Toggle admin status
  await user.save();

  res.status(200).json({ message: "User status updated successfully", user });
};

// Remove admin status
export const removeAdmin = async (req, res) => {
  const { adminId } = req.body; // Admin ID passed in request body

  try {
    const user = await User.findById(adminId);
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    user.isAdmin = false; // Set isAdmin to false
    await user.save();

    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
