import express from "express";
import { getGoogleReviews } from "../controllers/reviews.js";

const router = express.Router();

// Route to fetch Google reviews
router.get("/", getGoogleReviews);

export default router;
