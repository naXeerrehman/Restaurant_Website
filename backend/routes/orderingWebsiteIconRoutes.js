import express from "express";
import multer from "multer";
import {
  createIcon,
  getIcons,
  editIcon,
  deleteIcon,
} from "../controllers/orderingWebsiteIcon.js";

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // You can change the folder name as needed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set a unique filename
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route to create a new icon with image upload
router.post("/orderingWebsiteIcon", upload.single("image"), createIcon);

// Route to get all icons
router.get("/orderingWebsiteIcon", getIcons);

// Route to update an icon with image upload
router.put("/orderingWebsiteIcon/:id", upload.single("image"), editIcon);

// Route to delete an icon
router.delete("/orderingWebsiteIcon/:id", deleteIcon);

export default router;
