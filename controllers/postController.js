import Post from "../models/Post.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const userId = req.user.id; 

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newPost = await Post.create({
      title,
      description,
      image,
      author: userId
    });

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email") 
      .select("-__v"); 

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this post" });
    }

    
    if (req.file) {
      if (post.image) {
        const oldImagePath = path.join(__dirname, "..", "uploads", post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = req.file.filename;
    }

    post.title = title || post.title;
    post.description = description || post.description;

    const updatedPost = await post.save();
    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

   
    if (post.image) {
      const imagePath = path.join(__dirname, "..", "uploads", post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
