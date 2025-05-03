import Menu from "../models/Menu.js";
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
        const filename = `menu-${Date.now()}-${file.originalname}`;
        const buffer = await sharp(file.buffer)
          .resize(640, 930)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        const uploadPromise = new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream({ folder: "menus" }, (error, uploadedFile) => {
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

const createMenu = async (req, res) => {
  try {
    const { name } = req.body;

    const newMenu = new Menu({
      name,
      imageUrls: req.body.images,
    });

    await newMenu.save();
    res
      .status(201)
      .json({ message: "Menu uploaded successfully", menu: newMenu });
  } catch (error) {
    console.error("Error uploading menu:", error);
    res.status(500).json({ message: "Error uploading menu item", error });
  }
};

// Function to fetch all menu items
const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find({}); // Fetch all menus from the database
    if (!menus.length) {
      return res.status(404).json({ message: "No menu items found" });
    }
    res.status(200).json(menus); // Respond with the menus
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Function to get menu item by ID
const getMenuById = async (req, res) => {
  const id = req.params.id;

  try {
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Function to update menu item
const updateMenu = async (req, res) => {
  try {
    const { name } = req.body;

    // Find the existing menu item
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // Update fields
    menu.name = name || menu.name;

    // Handle image updates if new images are uploaded
    if (req.body.images && req.body.images.length > 0) {
      menu.imageUrls = req.body.images;
    }

    // Save the updated menu to the database
    await menu.save();

    res.status(200).json({
      message: "Menu updated successfully",
      menu,
    });
  } catch (error) {
    console.error("Error in updating menu:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Function to delete menu item
const deleteMenu = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(200).json({ message: "Menu deleted successfully", deletedMenu });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export { createMenu, getMenus, updateMenu, getMenuById, deleteMenu };
