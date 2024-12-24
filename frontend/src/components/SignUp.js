import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import googleLogo from "../assets/google_logo.png"; // Import the colorful Google logo

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, password };

    try {
      // Register the user and send OTP
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        userData
      );
      setMessage(response.data.message);
      setSuccess(true);

      // Navigate to the OTP verification page with email
      navigate("/VerifyOtp", { state: { email } });
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("Email already exists. Please try another email.");
      } else if (error.response?.status === 404) {
        setMessage(
          "Email does not exist. Please check the email and try again."
        );
      } else {
        setMessage(error.response?.data.message || "Error registering user.");
      }
      setSuccess(false);
    }
  };

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log("Received Google response:", credentialResponse);

      const idToken = credentialResponse?.credential;

      if (!idToken) {
        console.log("Google token not received.");
        setMessage("Google sign-up failed. Token not received.");
        setSuccess(false);
        return;
      }

      console.log("Received ID Token:", idToken);

      // Send the ID token to the backend
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/google-signup",
          { token: idToken }
        );
        console.log("Sign-up successful:", response.data);
        navigate("/VerifyOtp", {
          state: { email: response.data.user.email },
        });
      } catch (error) {
        console.error("Error signing up:", error);
        setMessage("Google sign-up failed. Please try again.");
        setSuccess(false);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      setMessage("Google sign-up failed. Please try again.");
      setSuccess(false);
    },
    prompt: "consent",
  });

  return (
    <div className="register">
      <form
        onSubmit={handleSubmit}
        className="border border-black w-[400px] mx-auto mt-10 flex flex-col gap-y-3 rounded-md"
      >
        <h2 className="bg-black text-white text-center w-[300px] mx-auto mt-5 mb-5 py-2 rounded-md">
          Sign Up
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
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-black px-1 rounded-md"
            autoComplete="name"
            required
          />
        </div>

        <div className="w-[300px] mx-auto flex flex-col py-1 px-1">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black px-1 rounded-md"
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
            className="absolute right-2 top-[35px]"
          >
            {showPassword ? <FaEye /> : <FaRegEyeSlash />}
          </button>
        </div>
        <button
          type="submit"
          className="border w-[300px] mx-[50px] bg-black text-white py-2 rounded-md"
        >
          Click To Sign Up
        </button>
        <h1 className="text-center mb-2">
          Already have an account?{" "}
          <Link className="font-semibold" to="/login">
            Log In
          </Link>{" "}
          here!
        </h1>
      </form>
      <div className="w-[400px] mx-auto mt-5">
        <h1 className="text-center mb-1">Or continue with Google</h1>
        <button
          onClick={handleGoogleSignUp}
          className="bg-white text-black border border-black px-4 rounded-md w-full flex items-center justify-center gap-x-5"
        >
          <img src={googleLogo} alt="Google Logo" className="w-6 h-[40px]" />{" "}
          {/* Google logo */}
          <h1>Sign Up with Google</h1>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
