import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Reset link sent to your email.");

        // Redirect to /NewPassword after 2 seconds
        setTimeout(() => {
          navigate("/NewPassword");
        }, 2000); // 2 second delay
      } else {
        setMessage(data.message || "Error sending reset link.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-center mb-3 mt-8 bg-black text-white w-[300px] mx-auto">
        Enter Email To Reset Your Password!
      </h1>
      <div className="w-[300px] mx-auto flex flex-col mt-5">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black px-1"
            autoComplete="email"
            required
          />
          <button
            type="submit"
            className="text-start bg-black text-white mt-2 w-[60px] px-1"
          >
            Submit
          </button>
        </form>
        {message && <p className="mt-2 text-red-500 mx-[80px]">{message}</p>}
      </div>
    </>
  );
};

export default ResetPassword;
