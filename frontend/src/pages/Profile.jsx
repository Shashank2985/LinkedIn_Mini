import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import ProfileCard from '../components/ProfileCard';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const targetUserId = userId || currentUser?._id;
    const isOwnProfile = !userId || currentUser?._id === userId;


    useEffect(() => {
        if (targetUserId && !authLoading) {
            fetchUserProfile();
        }
    }, [targetUserId, authLoading]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await usersAPI.getUserPosts(targetUserId);
            setProfileData(data);
        } catch (error) {
            setError('Failed to fetch profile');
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
                    <p className="mt-6 text-gray-700 text-lg font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
                    <svg className="w-20 h-20 text-pink-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile not found</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {error || 'The user you are looking for does not exist.'}
                    </p>
                </div>
            </div>
        );
    }

    // --- Image Upload Handlers ---
    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setUploadError('Only image files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be under 5MB.');
            return;
        }
        setUploadingProfile(true);
        setUploadError(null);
        try {
            const res = await usersAPI.uploadProfileImage(file);
            setProfileData((prev) => ({
                ...prev,
                user: { ...prev.user, profileImage: res.user.profileImage }
            }));
        } catch (err) {
            setUploadError('Failed to upload profile image.');
        } finally {
            setUploadingProfile(false);
        }
    };

    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];

        // Handle case where no file is selected
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Only image files are allowed.');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be under 5MB.');
            return;
        }

        setUploadingCover(true);
        setUploadError(null);

        try {
            // Upload to backend (which uploads to Cloudinary)
            const res = await usersAPI.uploadBackgroundImage(file);

            // Extract the Cloudinary URL from the response
            const cloudinaryUrl = res.user.backgroundImage;
            if (!cloudinaryUrl) {
                throw new Error('No background image URL received from server');
            }

            // Add cache busting query parameter to force image refresh
            const urlWithCacheBust = `${cloudinaryUrl}?t=${Date.now()}`;

            // Update the profile state with the new background image URL
            setProfileData((prev) => ({
                ...prev,
                user: {
                    ...prev.user,
                    backgroundImage: urlWithCacheBust
                }
            }));
        } catch (err) {
            console.error('Cover image upload failed:', err);
            setUploadError('Failed to upload cover image.');
        } finally {
            setUploadingCover(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
            {/* Banner Background */}
            <div className="relative">
                {/* Cover Photo */}
                <div className={`h-48 sm:h-64 relative overflow-hidden ${
                    profileData.user?.backgroundImage 
                        ? '' 
                        : 'bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600'
                }`}>
                    {profileData.user?.backgroundImage ? (
                        <>
                            <img
                                src={profileData.user.backgroundImage}
                                alt="Cover"
                                className="absolute inset-0 w-full h-full object-cover object-center"
                            />
                            {/* Subtle overlay only for uploaded images to improve text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </>
                    ) : (
                        /* Default gradient background when no image */
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    )}

                    {/* Uploading Overlay for Cover */}
                    {uploadingCover && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-2"></div>
                                <p className="text-sm font-medium">Uploading cover photo...</p>
                            </div>
                        </div>
                    )}

                    {/* Camera Icon for Cover */}
                    {isOwnProfile && (
                        <label className={`absolute top-3 right-3 bg-white bg-opacity-70 rounded-full p-2 shadow-md transition ${uploadingCover ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-pink-200'
                            }`} title="Change cover photo">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverImageChange}
                                disabled={uploadingCover}
                            />
                            {uploadingCover ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-600 border-t-transparent"></div>
                            ) : (
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a1 1 0 011-1zm9 3a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            )}
                        </label>
                    )}
                </div>

                {/* Profile Content Container */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header Card */}
                    <div className="relative -mt-24 sm:-mt-32">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                                {/* Profile Picture */}
                                <div className="relative">
                                    {profileData.user?.profileImage ? (
                                        <img
                                            src={profileData.user.profileImage}
                                            alt="Profile"
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg ring-4 ring-white"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg ring-4 ring-white">
                                            {profileData.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    {/* Uploading Overlay for Profile */}
                                    {uploadingProfile && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-2"></div>
                                                <p className="text-sm font-medium">Uploading profile photo...</p>
                                            </div>
                                        </div>
                                    )}
                                    {/* Camera Icon for Profile */}
                                    {isOwnProfile && (
                                        <label className={`absolute bottom-0 right-0 bg-white bg-opacity-70 rounded-full p-2 shadow-md transition ${uploadingProfile ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-pink-200'
                                            }`} title="Change profile photo">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleProfileImageChange}
                                                disabled={uploadingProfile}
                                            />
                                            {uploadingProfile ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-600 border-t-transparent"></div>
                                            ) : (
                                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a1 1 0 011-1zm9 3a4 4 0 100 8 4 4 0 000-8z" />
                                                </svg>
                                            )}
                                        </label>
                                    )}
                                </div>
                                {/* Profile Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                                {profileData.user?.name || 'Unknown User'}
                                            </h1>
                                            {profileData.user?.bio && (
                                                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                                    {profileData.user.bio}
                                                </p>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center space-x-6 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {profileData.posts?.length || 0}
                                                </div>
                                                <div className="text-sm text-gray-500 font-medium">
                                                    {profileData.posts?.length === 1 ? 'Post' : 'Posts'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {uploadError && (
                            <div className="mt-3 text-sm text-pink-700 bg-pink-50 rounded-lg px-4 py-2">
                                {uploadError}
                            </div>
                        )}
                    </div>

                    {/* Posts Section */}
                    <div className="mt-8 pb-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Section Header */}
                            <div className="bg-gradient-to-r from-pink-50 to-white px-6 sm:px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {isOwnProfile ? 'Your Posts' : `${profileData.user?.name}'s Posts`}
                                    </h2>
                                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        {profileData.posts?.length || 0} {profileData.posts?.length === 1 ? 'post' : 'posts'}
                                    </span>
                                </div>
                            </div>

                            {/* Posts Content */}
                            <div className="p-6 sm:p-8">
                                {!profileData.posts || profileData.posts.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                                            {isOwnProfile
                                                ? "Share your thoughts and connect with others!"
                                                : `${profileData.user?.name} hasn't shared anything yet.`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {profileData.posts.map((post) => (
                                            <PostCard
                                                key={post._id}
                                                post={{
                                                    ...post,
                                                    author: profileData.user // Add author info to each post
                                                }}
                                                showDelete={isOwnProfile} // Only show delete button for own posts on own profile
                                                onDelete={(deletedId) => setProfileData((prev) => ({
                                                    ...prev,
                                                    posts: prev.posts.filter((p) => p._id !== deletedId)
                                                }))}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;