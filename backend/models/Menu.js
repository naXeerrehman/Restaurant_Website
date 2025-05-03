import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
});

// Prevent OverwriteModelError by checking if the model exists
const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
