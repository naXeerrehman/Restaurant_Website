import express from "express";

import {
  CreateContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactForm.js";

const router = express.Router();

// Create a new contact
router.post("/create-message", CreateContact);

// Get all contacts
router.get("/", getAllContacts);

// Get a contact by ID
router.get("/:id", getContactById);

// Update a contact by ID
router.put("/:id", updateContact);

// Delete a contact by ID
router.delete("/:id", deleteContact);

export default router;
