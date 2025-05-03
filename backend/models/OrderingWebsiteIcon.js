import mongoose from "mongoose";

const OrderingWebsiteIconSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Cloudinary image URL
    link: { type: String, required: true }, // Link field
  },
  { timestamps: true }
);

const OrderingWebsiteIcon = mongoose.model(
  "OrderingWebsiteIcon",
  OrderingWebsiteIconSchema
);

export default OrderingWebsiteIcon;
