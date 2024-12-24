// This is the otp verification for Sign up, for sign in that is handled in the login in file.

import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the email passed in from the SignUp component
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      // Make the API request to verify the OTP
      const response = await axios.post(
        "http://localhost:5000/api/users/verify-otp",
        {
          email,
          otp,
        }
      );

      setMessage(response.data.message);
      setSuccess(true);

      // Redirect the user to a success page or dashboard
      setTimeout(() => {
        navigate("/Login"); // Example redirect
      }, 2000);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage(error.response?.data.message || "Error verifying OTP.");
      setSuccess(false);
    }
  };

  return (
    <div className="otp-verification">
      <form
        onSubmit={handleSubmit}
        className="border border-black w-[400px] mx-auto mt-10 flex flex-col gap-y-3 rounded-md"
      >
        <h2 className="bg-black text-white text-center w-[300px] mx-auto mt-5 mb-5 py-2 rounded-md">
          Verify OTP
        </h2>

        {message && (
          <p
            className={`text-center ${
              success ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="w-[300px] mx-auto flex flex-col py-1 px-1">
          <label>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-black px-1 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="border w-[300px] mx-[50px] bg-black text-white py-2 rounded-md mb-2"
        >
          Click To Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
