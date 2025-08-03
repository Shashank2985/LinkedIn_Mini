import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';

const PostCard = ({ post, onDelete, showDelete = false }) => {
    const { user: currentUser } = useAuth();
    const isAuthor = currentUser && post.author && currentUser._id === post.author._id;
    const [deleting, setDeleting] = React.useState(false);
    const [deleteError, setDeleteError] = React.useState(null);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await postsAPI.deletePost(post._id);
            if (onDelete) onDelete(post._id);
        } catch (err) {
            setDeleteError('Failed to delete post.');
        } finally {
            setDeleting(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        if (diffInDays < 7) return `${diffInDays}d`;

        return date.toLocaleDateString();
    };

    return (
        <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200">
            {/* Post Header */}
            <div className="flex items-start space-x-3 p-4 pb-3">
                <Link to={`/profile/${post.author?._id}`} className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                        post.author?.profileImage 
                            ? 'bg-gray-100' 
                            : 'bg-gradient-to-br from-pink-400 to-pink-500'
                    }`}>
                        {post.author?.profileImage ? (
                            <img
                                src={post.author.profileImage}
                                alt={post.author.name}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <Link
                            to={`/profile/${post.author?._id}`}
                            className="font-semibold text-gray-900 hover:text-pink-600 hover:underline transition-colors truncate"
                        >
                            {post.author?.name || 'Unknown User'}
                        </Link>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                            {formatDate(post.createdAt)}
                        </span>
                    </div>

                    {post.author?.bio && (
                        <p className="text-sm text-gray-600 truncate leading-tight">
                            {post.author.bio}
                        </p>
                    )}
                </div>
                {/* Delete icon for author (only if showDelete is true) */}
                {showDelete && isAuthor && (
                    <button
                        className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-1 shadow-md hover:bg-pink-100 transition z-10"
                        title="Delete post"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {/* Trash icon */}
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                    {post.content}
                </p>
                
                {/* Post Image */}
                {post.image && (
                    <div className="mt-3">
                        <img
                            src={post.image}
                            alt="Post content"
                            className="w-full rounded-lg object-cover max-h-96 border border-gray-200"
                        />
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="border-t border-gray-100 px-2 py-1">
                <div className="flex items-center justify-around">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 px-4 py-2 rounded-lg group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium hidden sm:inline">Like</span>
                    </button>

                    <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 px-4 py-2 rounded-lg group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-medium hidden sm:inline">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 px-4 py-2 rounded-lg group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="text-sm font-medium hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;