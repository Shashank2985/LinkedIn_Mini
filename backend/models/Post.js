import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String }, // Optional image URL
}, { timestamps: true });

// Custom validation to ensure at least content or image is provided
postSchema.pre('validate', function() {
    if (!this.content && !this.image) {
        this.invalidate('content', 'At least content or image must be provided');
    }
});

const Post = mongoose.model("Post", postSchema);
export default Post;
