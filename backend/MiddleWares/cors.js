// middleware.js
import express from "express";
import cors from "cors";

// Middleware configuration
const corsMiddleware = (app) => {
  // JSON middleware
  app.use(express.json());

  // CORS middleware
  app.use(
    cors({
      origin: "http://localhost:3000", // Your React app's URL
      credentials: true, // Allow credentials if needed
    })
  );
};

export default corsMiddleware;
