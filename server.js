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
app.use(cors()); 

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

app.use("/uploads", express.static(uploadDir)); 


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
