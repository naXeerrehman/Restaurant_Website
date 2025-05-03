// middleware.js
import express from "express";
import cors from "cors";

// Middleware configuration
const corsMiddleware = (app) => {
  // JSON middleware
  app.use(express.json());

  const FRONTEND_URL = process.env.FRONTEND_URL;

  // CORS middleware
  app.use(
    cors({
      origin: `${FRONTEND_URL}`, // Your React app's URL
      credentials: true, // Allow credentials if needed
    })
  );
};

export default corsMiddleware;
