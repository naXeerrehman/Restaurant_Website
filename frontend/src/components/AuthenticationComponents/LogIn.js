import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import FastFood6 from "../../assets/FastFood6.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to homepage if already logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoginLoading(true); // Use login-specific loading
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      setMessage(response.data.message);
      setSuccess(true);

      if (response.data.message.includes("OTP")) {
        setOtpSent(true);
      }

      if (response.data.token) {
        localStorage.setItem("email", email);
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      setMessage(error.response?.data.message || "Error during login process.");
      setSuccess(false);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading(true); // Use OTP-specific loading
      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data.message || "Error during OTP verification."
      );
      setSuccess(false);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div>
      {/* Background Image */}
      <div className="absolute w-full">
        <img src={FastFood6} alt="FastFood_image" className="w-full h-screen" />
      </div>
      {/* Content */}
       <div className="relative inset-0 flex items-center justify-center pt-20 md:pt-44 lg:pt-10">
        {!otpSent ? (
          <form
            onSubmit={handleLogin}
           className="w-full max-w-md p-8"
          >
            <h1 className="text-2xl font-bold bg-red-600 text-white rounded-md py-2 text-center mb-6">
              Login
            </h1>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm md:text-2xl font-bold text-white"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm md:text-2xl font-bold text-white"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-black"
                >
                  {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <Link
                to="/ResetPassword"
                className="font-semibold text-white md:text-2xl"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-sm md:text-2xl text-white mb-6">
              Don't have an account?{" "}
              <Link to="/SignUpPage" className="font-semibold text-white">
                Sign up here!
              </Link>
            </div>

            {message && (
              <p className={`text-center text-2xl mb-1 text-white bg-red-600`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className={`w-full font-bold bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors ${
                loginLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loginLoading ? "Logging in..." : "Click To Login"}
            </button>
          </form>
        ) : (
          <div className="p-6 w-full max-w-md pt-32 md:pt-44">
            <h2 className="text-2xl font-bold bg-red-600 text-white rounded-md py-1 text-center mb-6">
              Verify Your OTP
            </h2>
            {message && (
              <p className={`text-center text-sm bg-red-600 text-white`}>
                {message}
              </p>
            )}
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm md:text-2xl text-white font-bold"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className={`w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-bold md:text-2xl ${
                  otpLoading ? "opacity-50 cursor-not-allowed" : ""
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

export default Login;
