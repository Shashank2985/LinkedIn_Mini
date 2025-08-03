import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import PostCard from '../components/PostCard';
import ProfileCard from '../components/ProfileCard';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setError(null);
            const data = await postsAPI.getAllPosts();
            setPosts(data);
        } catch (error) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Only image files are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be under 5MB');
            return;
        }

        setSelectedImage(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        setError(null);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
            console.error('Image upload failed:', errorData);
            throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();
        return data.imageUrl;
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !selectedImage) return;

        setPosting(true);
        setUploadingImage(!!selectedImage);
        try {
            let imageUrl = null;

            // Upload image first if selected
            if (selectedImage) {
                imageUrl = await uploadImage(selectedImage);
                setUploadingImage(false);
            }

            const postData = await postsAPI.createPost({
                content: newPost,
                image: imageUrl
            });

            // Add the new post to the beginning of the posts array
            const postWithAuthor = {
                ...postData,
                author: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage
                }
            };

            setPosts([postWithAuthor, ...posts]);
            setNewPost('');
            setSelectedImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post: ' + (error.response?.data?.message || error.message));
        } finally {
            setPosting(false);
            setUploadingImage(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-4">
                            <ProfileCard
                                user={user}
                                postsCount={posts.filter(post => post.author?._id === user?._id).length}
                            />

                            {/* Quick Actions Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors">
                                        📝 Write an article
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors">
                                        📷 Add a photo
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors">
                                        🎉 Celebrate an achievement
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Create Post Form */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                            <form onSubmit={handleCreatePost}>
                                <div className="flex space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <textarea
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            placeholder="What do you want to talk about?"
                                            className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder-gray-500"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-4 relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-4 text-gray-500">
                                        <label className="flex items-center space-x-2 hover:text-pink-600 transition-colors cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                            />
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm hidden sm:inline">Photo</span>
                                        </label>
                                        <button type="button" className="flex items-center space-x-2 hover:text-pink-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm hidden sm:inline">Video</span>
                                        </button>
                                        <button type="button" className="flex items-center space-x-2 hover:text-pink-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-sm hidden sm:inline">Article</span>
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={(!newPost.trim() && !selectedImage) || posting}
                                        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                                    >
                                        {uploadingImage ? 'Uploading...' : posting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Posts Feed */}
                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                                    <p className="text-gray-600">Be the first to share something with the community!</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        showDelete={true}
                                        onDelete={(deletedId) => setPosts(prev => prev.filter(p => p._id !== deletedId))}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;