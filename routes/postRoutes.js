import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createPost); 
router.get("/", getAllPosts); 
router.get("/:id", getPostById); 
router.put("/:id", authMiddleware, upload.single("image"), updatePost); 
router.delete("/:id", authMiddleware, deletePost); 

export default router;
