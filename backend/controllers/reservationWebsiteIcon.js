import cloudinary from "cloudinary";
import ReservationWebsiteIcon from "../models/ReservationWebsiteIcon.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createIcon = async (req, res) => {
  try {
    const { link } = req.body;
    const image = req.file; // Single image file from multer

    if (!link || !image) {
      return res
        .status(400)
        .json({ message: "Both link and image are required." });
    }

    const result = await cloudinary.v2.uploader.upload(image.path);
    const newIcon = new ReservationWebsiteIcon({
      link,
      image: result.secure_url,
    });

    const savedIcon = await newIcon.save();
    res.status(201).json(savedIcon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create icon.", error });
  }
};

const editIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const { link } = req.body;
    const image = req.file; // Single image file from multer

    if (!link) {
      return res.status(400).json({ message: "Link is required." });
    }

    let updatedData = { link };

    if (image) {
      const result = await cloudinary.v2.uploader.upload(image.path);
      updatedData.image = result.secure_url;
    }

    const updatedIcon = await ReservationWebsiteIcon.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedIcon) {
      return res.status(404).json({ message: "Icon not found." });
    }

    res.status(200).json(updatedIcon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update icon.", error });
  }
};

// Get All Icons
const getIcons = async (req, res) => {
  try {
    const icons = await ReservationWebsiteIcon.find(); // Fetch all icons
    res.status(200).json(icons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch icons.", error });
  }
};

// Delete Icon
const deleteIcon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIcon = await ReservationWebsiteIcon.findByIdAndDelete(id);

    if (deletedIcon) {
      return res.status(200).json({ message: "Icon deleted successfully" });
    } else {
      return res.status(404).json({ message: "Icon not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting the icon" });
  }
};

export { createIcon, getIcons, editIcon, deleteIcon };
