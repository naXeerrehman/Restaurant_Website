import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("email")) {
      navigate("/"); // If already logged in, redirect to homepage
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      setMessage(response.data.message);
      setSuccess(true);

      if (response.data.message.includes("OTP")) {
        setOtpSent(true);
      }

      // Store email in localStorage on successful login
      if (response.data.token) {
        localStorage.setItem("email", email); // Store email in localStorage
        localStorage.setItem("token", response.data.token); // Store token in localStorage
      }
    } catch (error) {
      // Handle user not found error (e.g., 404)
      if (error.response?.status === 404) {
        setMessage("User not found. Please check your email and try again.");
      }
      // Handle invalid credentials error (e.g., 401)
      else if (error.response?.status === 401) {
        setMessage(
          "Invalid credentials. Please check your password and try again."
        );
      } else {
        setMessage(error.response?.data.message || "Error during login.");
      }
      setSuccess(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );
      console.log("Response from server:", response.data);
      setMessage(response.data.message);
      setSuccess(true);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirect after successful verification
      }
    } catch (error) {
      setMessage(error.response?.data.message || "Invalid OTP.");
      setSuccess(false);
    }
  };

  return (
    <div>
      {!otpSent ? (
        <form
          onSubmit={handleLogin}
          className="border border-black w-[380px] mx-auto mt-[40px] rounded-md"
        >
          <h1 className="bg-black text-white w-[300px] text-center mx-auto py-2 mt-5 mb-[40px] rounded-md">
            Login
          </h1>

          {/* Show error message above email if invalid credentials */}
          {message && success === false && (
            <p className="text-red-500 text-center mb-4">{message}</p>
          )}

          <div className="flex flex-col mx-[40px] mt-5 mb-[40px]">
            <label>Email</label>
            <input
              type="email"
              className="border border-black w-[300px] px-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="w-[300px] mx-auto flex flex-col py-1 px-1 relative">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black px-1 rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-[33px]"
            >
              {showPassword ? <FaEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className="border w-[300px] mx-[40px] mb-2 bg-black text-white py-2 mt-5 rounded-md"
          >
            Click To Login
          </button>
          <h1 className="text-center mb-1">
            Forgot password?{" "}
            <Link to="/ResetPassword" className="font-semibold">
              Click here!
            </Link>
          </h1>
          <h1 className="text-center mb-3">
            Don't have an account?{" "}
            <Link className="font-semibold" to="/SignUp">
              Register
            </Link>{" "}
            here!
          </h1>
        </form>
      ) : (
        <div className="verify-otp">
          <h2 className="bg-black text-white text-center w-[300px] mx-auto mt-5 mb-5 py-2 rounded-md">
            Verify Your OTP
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

          <form
            onSubmit={handleOtpVerification}
            className="border border-black w-[400px] mx-auto mt-10 flex flex-col gap-y-3 rounded-md"
          >
            <div className="w-[300px] mx-auto flex flex-col py-1 px-1">
              <label>Enter OTP:</label>
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
              className="border w-[300px] mx-[50px] mb-2 bg-black text-white py-2 rounded-md"
            >
              Click To Verify OTP
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
