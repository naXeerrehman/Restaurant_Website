import express from "express";
import {
  uploadImages,
  resizeImages,
  createMenu,
  getMenus,
  updateMenu,
  getMenuById,
  deleteMenu,
} from "../controllers/menuCrud.js";

const router = express.Router();

// Route to create a new menu item with image upload
router.post("/create-menu", uploadImages, resizeImages, createMenu);

// Route to fetch all menu items
router.get("/", getMenus);

// Route to fetch a single menu item by ID
router.get("/:id", getMenuById);

// Route to update a menu item by ID with image upload support
router.put("/:id", uploadImages, resizeImages, updateMenu);

// Route to delete a menu item by ID
router.delete("/:id", deleteMenu);

export default router;
