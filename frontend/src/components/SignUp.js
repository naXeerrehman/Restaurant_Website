import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/google_logo.png";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // For OTP verification
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const userData = { name, email, password };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        userData
      );
      setMessage(response.data.message);
      setOtpSent(true); // OTP has been sent
    } catch (error) {
      setMessage(
        error.response?.data.message || "Error during registration process."
      );
      setSuccess(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/verify-otp",
        {
          email,
          otp,
        }
      );

      // Store JWT token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to dashboard or home
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data.message || "Error during OTP verification process."
      );
      setSuccess(false);
    }
  };

  // const handleGoogleSignUp = useGoogleLogin({
  //   onSuccess: async (credentialResponse) => {
  //     console.log("Received Google response:", credentialResponse);

  //     const idToken = credentialResponse?.credential;

  //     if (!idToken) {
  //       console.log("Google token not received.");
  //       setMessage("Google sign-up failed. Token not received.");
  //       setSuccess(false);
  //       return;
  //     }

  //     console.log("Received ID Token:", idToken);

  //     // Send the ID token to the backend
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:5000/api/users/google-signup",
  //         { token: idToken }
  //       );
  //       console.log("Sign-up successful:", response.data);
  //       navigate("/VerifyOtp", {
  //         state: { email: response.data.user.email },
  //       });
  //     } catch (error) {
  //       console.error("Error signing up:", error);
  //       setMessage("Google sign-up failed. Please try again.");
  //       setSuccess(false);
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Google login failed:", error);
  //     setMessage("Google sign-up failed. Please try again.");
  //     setSuccess(false);
  //   },
  //   prompt: "consent",
  // });

  return (
    <div>
      {!otpSent ? (
        <>
          <form
            onSubmit={handleSignUp}
            className="border border-black w-[380px] mx-auto mt-[40px] rounded-md"
          >
            <h1 className="bg-black text-white w-[300px] text-center mx-auto py-2 mt-5 mb-[40px] rounded-md">
              Sign Up
            </h1>

            {message && (
              <p
                className={`text-center ${
                  success ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex flex-col mx-[40px] mt-5 mb-[40px]">
              <label>Name</label>
              <input
                type="text"
                className="border border-black w-[300px] px-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col mx-[40px] mb-[40px]">
              <label>Email</label>
              <input
                type="email"
                className="border border-black w-[300px] px-2 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <h1 className="text-center mb-3">
              Already have an account?{" "}
              <Link className="font-semibold" to="/Login">
                Login{" "}
              </Link>
              here!
            </h1>
            <button
              type="submit"
              className="border w-[300px] mx-[40px] mb-2 bg-black text-white py-2 mt-2 rounded-md"
            >
              Register
            </button>
          </form>
          <div className="w-[400px] mx-auto mt-5">
            <h1 className="text-center mb-1">Or continue with Google</h1>
            <button
              // onClick={handleGoogleSignUp}
              className="bg-white text-black border border-black px-4 rounded-md w-[380px] mx-auto flex items-center justify-center gap-x-5"
            >
              <img
                src={googleLogo}
                alt="Google Logo"
                className="w-8 h-[40px]"
              />{" "}
              {/* Google logo */}
              <h1>Sign Up with Google</h1>
            </button>
          </div>
        </>
      ) : (
        <div className="verify-otp">
          <h2 className="bg-black text-white text-center w-[300px] mx-auto mt-5 mb-5 py-2 rounded-md">
            Verify Your OTP
          </h2>
          {message && (
            <p
              className={`text-center ${
                success ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}

          <form
            onSubmit={handleOtpVerify}
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
              Verify OTP
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUp;