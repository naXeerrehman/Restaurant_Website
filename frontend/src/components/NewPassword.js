import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NewPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/new-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/"); // Navigate to home page
        }, 2000);
      } else {
        setMessage(data.message || "Error updating password.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-[200px] lg:mx-[530px]"
      >
        <h1 className="bg-black text-white py-2 w-[300px] text-center mt-3 mb-3">
          Enter New Password
        </h1>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-[300px] border border-black mb-3"
          required
        />
        <button
          type="submit"
          className="flex flex-start bg-black text-white w-[80px] px-3"
        >
          Submit
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default NewPassword;
