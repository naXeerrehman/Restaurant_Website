import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import FastFood6 from "../../assets/FastFood6.jpg";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("Password must be 8 characters or more.");
      setSuccess(false);
      return;
    }

    const userData = { name, email, password };

    try {
      setSignUpLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        userData
      );
      setMessage(response.data.message);
      setOtpSent(true);
      setSuccess(true);
    } catch (error) {
      setMessage(
        error.response?.data.message || "Error during registration process."
      );
      setSuccess(false);
    } finally {
      setSignUpLoading(false); // Always set loading to false when done
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      setOtpLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/users/verify-otp`, {
        email,
        otp,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data.message || "Error during OTP verification process."
      );
      setSuccess(false);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
     {/* Background Image */}
      <div className="absolute w-full">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-screen" />
      </div>

      {/* Content */}
     <div className="relative inset-0 flex items-center justify-center pt-20 md:pt-44 lg:pt-10">
        {!otpSent ? (
          <form onSubmit={handleSignUp} className="w-full max-w-md p-8">
            <h1 className="text-2xl font-bold bg-red-600 text-white rounded-md py-2 text-center mb-6">
              Sign Up
            </h1>

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-white md:text-2xl"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-white md:text-2xl"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white md:text-2xl"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  placeholder="Enter Your Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div className="text-sm text-white mb-4 md:text-2xl">
              Already have an account?{" "}
              <Link to="/loginPage" className="font-semibold text-white">
                Log in here!
              </Link>
            </div>

            {message && (
              <p
                className={`text-center text-sm py-2 ${
                  success ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={signUpLoading}
              className={`w-full font-bold bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors ${
                signUpLoading ? "opacity-70" : ""
              }`}
            >
              {signUpLoading ? "Signing Up..." : "Click To Sign Up"}
            </button>
          </form>
        ) : (
          <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold bg-red-600 text-white rounded-md py-2 text-center mb-6">
              Verify Your OTP
            </h2>
            {message && (
              <p className={`text-center text-sm py-2 text-white bg-red-600`}>
                {message}
              </p>
            )}
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-bold text-white"
                >
                  Enter OTP:
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className={`w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-bold transition-colors ${
                  otpLoading ? "opacity-70" : ""
                }`}
              >
                {otpLoading ? "Verifying OTP..." : "Click To Verify OTP"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
