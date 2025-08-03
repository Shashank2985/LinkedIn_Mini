import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg">in</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">Mini LinkedIn</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated ? (
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-pink-600 transition-colors group"
                            >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                <span className="text-xs font-medium">Home</span>
                            </Link>

                            <Link to={`/profile/${user?._id}`}
                                className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-pink-600 transition-colors group"
                            >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium">Me</span>
                            </Link>

                            {/* Profile Avatar & Dropdown */}
                            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden lg:block">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-pink-600 transition-colors px-2 py-1 rounded-md hover:bg-pink-50"
                                    title="Logout"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-pink-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-pink-50"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                                Join now
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        {isAuthenticated ? (
                            <div className="space-y-3">
                                <Link
                                    to="/"
                                    className="block text-gray-600 hover:text-pink-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    to={`/profile/${user?._id}`}
                                    className="block text-gray-600 hover:text-pink-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Hi, {user?.name}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-red-600 hover:text-red-800"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="block text-pink-400 hover:text-pink-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-pink-400 hover:text-pink-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;