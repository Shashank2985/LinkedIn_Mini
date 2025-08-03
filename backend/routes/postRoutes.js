// routes/postRoutes.js
import express from "express";
import { createPost, getAllPosts, getUserPosts, deletePost } from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/:userId", getUserPosts);
router.delete("/:id", authMiddleware, deletePost);

export default router;
