// controllers/postController.js
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    const { content, image } = req.body;
    const userId = req.user.id;

    console.log('📝 Creating post with data:', { content, image: image ? 'IMAGE_PROVIDED' : 'NO_IMAGE', userId });

    try {
        const postData = { content, author: userId };
        if (image) {
            postData.image = image;
            console.log('🖼️ Adding image to post:', image.substring(0, 50) + '...');
        }
        
        console.log('💾 Saving post to database...');
        const post = await Post.create(postData);
        console.log('✅ Post created successfully:', post._id);
        
        res.status(201).json(post);
    } catch (err) {
        console.error('❌ Error creating post:', err);
        res.status(500).json({ message: "Could not create post", error: err.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "name email profileImage").sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

export const getUserPosts = async (req, res) => {
    const userId = req.params.userId;

    try {
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
        const user = await User.findById(userId).select("name email bio profileImage backgroundImage");
        res.json({ user, posts });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user posts" });
    }
};

// Delete a post (only by the author)
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own posts' });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
