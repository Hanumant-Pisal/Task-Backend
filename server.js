import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import path from "path";
import fs from "fs";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
    credentials: true  // Allow cookies to be sent with requests
  };
  
  // Use the CORS middleware
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(uploadDir));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
