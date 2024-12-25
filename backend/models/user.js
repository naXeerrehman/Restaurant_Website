import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Admin flag
    otp: { type: String }, // Field to store the OTP
    role: { type: String, default: "user" },
    otpExpires: { type: Date }, // Field to store OTP expiration time
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
