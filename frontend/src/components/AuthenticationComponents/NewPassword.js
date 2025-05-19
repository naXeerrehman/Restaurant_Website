import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import FastFood6 from "../../assets/FastFood6.jpg";

const NewPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Check if token exists in URL (coming from email)
    if (token) {
      setMessage("Please enter your new password");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/auth/new-password/${token}`,
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
        setMessage("Password updated successfully! Redirecting to login...");
        setLoading(false);
        setTimeout(() => {
          navigate("/loginPage"); // Redirect to login page
        }, 2000);
      } else {
        setMessage(data.message || "Error updating password.");
        setLoading(false);
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-full" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative mt-44 md:mt-72 lg:mt-36 px-12 md:px-44 lg:px-96"
      >
        <h1 className="bg-red-600 text-white text-center rounded-md font-bold text-xl p-1 py-2 mb-4">
          Enter New Password
        </h1>

        <label className="text-white block">New Password</label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter New Password"
            autoComplete="new-password"
            className="p-2 rounded-md w-full mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            minLength="6"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute top-3 right-3 text-gray-600"
          >
            {passwordVisible ? <FaEye /> : <FaRegEyeSlash />}
          </button>
        </div>
        {message && (
          <p className={`mb-4 text-center bg-red-600 text-white`}>{message}</p>
        )}
        <button
          type="submit"
          className={`bg-red-600 text-white px-4 py-2 rounded-md w-full ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
          }`}
          disabled={loading}
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
