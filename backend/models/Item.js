import mongoose from "mongoose";

// Define the schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: { type: [String], default: [] },
});

export default mongoose.model("Item", itemSchema);
