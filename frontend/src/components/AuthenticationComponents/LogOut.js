import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FastFood6 from "../../assets/FastFood6.jpg";
const LogoutPage = () => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(true); // State to control confirmation dialog visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("email"); // Clear email
    setShowConfirmLogout(false); // Close the confirmation dialog
    navigate("/LogInPage"); // Navigate to the login page after logout
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false); // Close the confirmation dialog
    navigate("/"); // Redirect to home or wherever you want to go after cancelling
  };

  return (
    <div>
      {/* Background Image */}
      <div className="absolute w-full">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-screen" />
      </div>
      {/* content */}
      <div className="px-4 md:px-24 lg:px-[340px] pt-[200px] md:pt-[300px] lg:pt-[160px]">
        {showConfirmLogout && (
          <div className="relative bg-white p-8 rounded-lg">
            <h2 className="text-2xl text-center mb-4 md:text-4xl">
              Are you sure you want to log out?
            </h2>

            <div className="flex justify-between md:text-3xl">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded w-full mr-2"
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
    </div>
  );
};

export default LogoutPage;
