import Item from "../models/Item.js";
import cloudinary from "cloudinary";
import sharp from "sharp";
import multer from "multer";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// In-memory file storage configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFiles = upload.array("images", 10); // Handle up to 10 images

export const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({ message: "Too many files to upload!" });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    next();
  });
};

export const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `item-${Date.now()}-${file.originalname}`;
        const buffer = await sharp(file.buffer)
          .resize(700)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        const uploadPromise = new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream({ folder: "items" }, (error, uploadedFile) => {
              if (error) {
                reject(new Error("Cloudinary upload failed"));
              } else {
                req.body.images.push(uploadedFile.secure_url);
                resolve();
              }
            })
            .end(buffer); // Use sharp's buffer as input to Cloudinary
        });

        await uploadPromise;
      })
    );

    next();
  } catch (error) {
    console.error("Error resizing and uploading images:", error);
    res.status(500).json({ message: "Error processing images", error });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    const newItem = new Item({
      name,
      price,
      imageUrls: req.body.images,
    });

    await newItem.save();
    res
      .status(201)
      .json({ message: "Food uploaded successfully", item: newItem });
  } catch (error) {
    console.error("Error uploading item:", error);
    res.status(500).json({ message: "Error uploading item", error });
  }
};

// Function to fetch all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find({}); // Fetch all items from the database
    if (!items.length) {
      return res.status(404).json({ message: "No items found" });
    }
    res.status(200).json(items); // Respond with the items
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Function to get item by ID
const getItemById = async (req, res) => {
  const id = req.params.id;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Function to update item
const updateItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Find the existing items
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Update fields
    item.name = name || item.name;
    item.price = price || item.price;

    // Handle image updates if new images are uploaded
    if (req.body.images && req.body.images.length > 0) {
      item.imageUrls = req.body.images;
    }
    // Save the updated item to the database
    await item.save();

    res.status(200).json({
      message: "Food updated successfully",
      item,
    });
  } catch (error) {
    console.error("Error in updating item:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Function to delete item
const deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Food deleted successfully", deletedItem });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error }); // Handle errors
  }
};

export { createItem, getItems, updateItem, getItemById, deleteItem };
