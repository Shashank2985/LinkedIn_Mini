import React from 'react';

const ProfileCard = ({ user, postsCount = 0 }) => {
    if (!user) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Cover Image */}
            <div className="h-20 bg-gradient-to-r from-pink-400 to-pink-600"></div>

            {/* Profile Content */}
            <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-10 mb-4">
                    <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {user.name}
                    </h2>

                    <p className="text-sm text-gray-600 mb-2">
                        {user.email}
                    </p>

                    {user.bio && (
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex justify-center items-center space-x-6 pt-4 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{postsCount}</div>
                            <div className="text-sm text-gray-600">Posts</div>
                        </div>

                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Connections</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;