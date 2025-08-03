import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Register = () => {
    const { register, isAuthenticated, error, clearError } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleRegister = async (formData) => {
        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                bio: formData.bio || ''
            });
            // Navigation will happen automatically due to the useEffect above
        } catch (error) {
            // Error is handled by the AuthContext
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            type="register"
            onSubmit={handleRegister}
            loading={loading}
            error={error}
        />
    );
};

export default Register;