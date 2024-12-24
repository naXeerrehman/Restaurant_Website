import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(true); // State to control confirmation dialog visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("email"); // Clear email
    setShowConfirmLogout(false); // Close the confirmation dialog
    navigate("/LogIn"); // Navigate to the login page after logout
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false); // Close the confirmation dialog
    navigate("/"); // Redirect to home or wherever you want to go after cancelling
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black bg-opacity-50">
      {showConfirmLogout && (
        <div className="bg-white p-8 rounded-lg w-[350px]">
          <h2 className="text-2xl text-center mb-4">
            Are you sure you want to log out?
          </h2>

          <div className="flex justify-between">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded w-full mr-2"
            >
              Yes, Log Out
            </button>
            <button
              onClick={handleCancelLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutPage;
