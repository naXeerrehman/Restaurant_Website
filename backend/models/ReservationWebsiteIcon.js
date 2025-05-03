import mongoose from "mongoose";

const ReservationWebsiteIconSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Cloudinary image URL
    link: { type: String, required: true }, // Link field
  },
  { timestamps: true }
);

const ReservationWebsiteIcon = mongoose.model(
  "ReservationWebsiteIcon",
  ReservationWebsiteIconSchema
);

export default ReservationWebsiteIcon;
