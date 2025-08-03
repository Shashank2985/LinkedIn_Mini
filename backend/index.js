import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
connectDB();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration - simplified for single deployment
app.use(cors({
    origin: true, // Allow all origins since we're serving from same domain
    credentials: true
}));

app.use(express.json()); // for JSON body parsing
app.use(cookieParser()); // for parsing cookies

// API Routes (must come before static files)
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static files from frontend build
if (process.env.NODE_ENV === "production") {
    // Serve static files from the frontend dist directory
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Handle React Router - send all non-API requests to index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
} else {
    // Development mode - API status endpoint
    app.get("/", (req, res) => {
        res.send("Mini LinkedIn API is running in development mode...");
    });
}

app.get("/", (req, res) => {
    res.send("Mini LinkedIn API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
