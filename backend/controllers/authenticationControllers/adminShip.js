import User from "../../models/user.js"; // Assuming you have a user model
import dotenv from "dotenv";

dotenv.config();

// Function to send a notification email to all admins
const notifyAdmins = async (subject, text) => {
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
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admins notified successfully");
  } catch (error) {
    console.error("Error notifying admins:", error);
  }
};

// Toggle admin status
export const toggleAdminStatus = async (req, res) => {
  const { userId } = req.body; // User ID passed in request body

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = !user.isAdmin; // Toggle admin status
    await user.save();

    // Notify admins about the change
    const action = user.isAdmin ? "added as an admin" : "removed as an admin";
    const subject = `User ${user.name} Admin Status Changed`;
    const text = `User ${user.name} of Email (${user.email}) has been ${action}.`;

    await notifyAdmins(subject, text);

    res.status(200).json({ message: "User status updated successfully", user });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    res.status(500).json({ message: "Server error" });
  }
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

    // Notify admins about the change
    const subject = `Admin Removed`;
    const text = `User ${user.name} (${user.email}) has been removed as an admin.`;

    await notifyAdmins(subject, text);

    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
