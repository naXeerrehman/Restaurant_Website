import express from "express";
import {
  uploadImages,
  resizeImages,
  createItem,
  getItems,
  updateItem,
  getItemById,
  deleteItem,
} from "../controllers/itemCrud.js";

const router = express.Router();

// Route to create a new item with images
router.post("/create-item", uploadImages, resizeImages, createItem);

// Route to get all item
router.get("/", getItems);
// Route to get a item by ID
router.get("/:id", getItemById);

// Route to update a item
router.put("/:id", uploadImages, resizeImages, updateItem);

// Route to delete a item by ID
router.delete("/:id", deleteItem);

export default router;
