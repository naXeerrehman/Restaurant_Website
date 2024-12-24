import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // State to show confirmation dialog
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if token exists for logged-in status

    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Log the decoded token
        setIsAdmin(decodedToken.isAdmin); // Assumes the token has 'isAdmin' property
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    setIsLoggedIn(false);
    setIsAdmin(false); // Reset admin state on logout
    navigate("/LogIn");
  };

  const handleConfirmLogout = () => {
    setShowConfirmLogout(true); // Show the confirmation dialog
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false); // Close the confirmation dialog
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-black text-white flex justify-between px-5 py-2">
        <div className="font-semibold">Auth App</div>
        <div className="flex gap-x-3 items-center">
          {isLoggedIn && isAdmin && (
            <>
              <Link to="/RegisteredUsers" className="border px-1 rounded-md">
                Registered users
              </Link>
            </>
          )}
          <Link to="/SignUp" className="border px-1 rounded-md">
            Sign up
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleConfirmLogout}
              className="border px-1 rounded-md"
            >
              Log out
            </button>
          ) : (
            <Link to="/LogIn" className="border px-1 rounded-md">
              Log in
            </Link>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Logout */}
      {showConfirmLogout && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-center mb-4">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Yes, Log Out
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-gray-500 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Functionalities Section */}
      <div className="flex flex-col">
        <div className="text-center font-semibold mt-5 mb-2">
          Authentication App With The Functionalities Of
        </div>
        <Link
          to="/SignUp"
          className="border-b border-black w-[150px] mx-auto mb-2 text-center font-semibold"
        >
          Register User
        </Link>
        <Link
          to="/LogIn"
          className="border-b border-black w-[150px] mx-auto mb-2 text-center font-semibold"
        >
          Login User
        </Link>
        <Link
          to="/LogOut"
          className="border-b border-black w-[150px] mx-auto mb-2 text-center font-semibold"
        >
          Log Out User
        </Link>
        <Link
          to="/ResetPassword"
          className="border-b border-black w-[150px] mx-auto mb-2 text-center font-semibold"
        >
          Reset Password
        </Link>
        <Link
          to="/RegisteredUsers"
          className="border-b border-black w-[150px] mx-auto mb-2 text-center font-semibold"
        >
          Update User
        </Link>
        <Link
          to="/RegisteredUsers"
          className="border-b border-black w-[150px] mx-auto mb-2 text-center font-semibold"
        >
          Delete User
        </Link>
        <Link
          to=""
          className="border-b border-black w-[200px] mx-auto text-center font-semibold"
        >
          Two Factor Authentication
        </Link>
      </div>
    </>
  );
};

export default Navbar;
