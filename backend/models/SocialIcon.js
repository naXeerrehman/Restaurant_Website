import mongoose from "mongoose";

const iconSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Cloudinary image URL
    link: { type: String, required: true }, // Link field
  },
  { timestamps: true }
);

const SocialIcon = mongoose.model("SocialIcon", iconSchema);

export default SocialIcon;
