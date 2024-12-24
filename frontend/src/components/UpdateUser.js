import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const UpdateUser = ({ user, setEditUser, setUsers, setSuccessMessage }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(""); // Optional password
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        name,
        email,
        password,
      });

      // Update user list
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === user._id ? { ...u, name, email } : u))
      );

      // Set success message
      setSuccessMessage("User updated successfully!");

      setEditUser(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-black p-4">
      <h2>Edit User</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-2 py-1 w-full"
        />
      </div>
      <div className="mt-4">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-2 py-1 w-full"
        />
      </div>
      <div className="mt-4">
        <label>Password (Optional):</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-2 py-1 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <FaEye /> : <FaRegEyeSlash />} {/* Eye icon */}
          </button>
        </div>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-4">
        Update User
      </button>
      <button
        type="button"
        onClick={() => setEditUser(null)}
        className="ml-2 bg-red-500 text-white px-4 py-2 mt-4"
      >
        Cancel
      </button>
    </form>
  );
};

export default UpdateUser;
