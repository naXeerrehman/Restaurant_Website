import express from "express";
import cors from "cors";

const corsMiddleware = (app) => {
  app.use(express.json());

  const allowedOrigins = [
    process.env.FRONTEND_URL, // From environment variable
    'https://restaurant-website-henna-two.vercel.app',
    'http://localhost:3000'
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
};

export default corsMiddleware;
