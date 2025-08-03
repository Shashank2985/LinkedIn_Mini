import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth APIs
export const authAPI = {
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    }
};

// Posts APIs
export const postsAPI = {
    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },
    getAllPosts: async () => {
        const response = await api.get("/posts");
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post("/posts", postData);
        return response.data;
    },

    getUserPosts: async (userId) => {
        const response = await api.get(`/posts/${userId}`);
        return response.data;
    }
};

// Users APIs
export const usersAPI = {
    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append('profileImage', file);
        const response = await api.put('/users/me/profile-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    uploadBackgroundImage: async (file) => {
        const formData = new FormData();
        formData.append('backgroundImage', file);
        const response = await api.put('/users/me/background-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put("/users/me", profileData);
        return response.data;
    },

    getUserPosts: async (userId) => {
        const response = await api.get(`/users/${userId}/posts`);
        return response.data;
    }
};

export default api;
