import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
    const { login, isAuthenticated, error, clearError } = useAuth();
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

    const handleLogin = async (formData) => {
        setLoading(true);
        try {
            await login({
                email: formData.email,
                password: formData.password
            });
            // Navigation will happen automatically due to the useEffect above
        } catch (error) {
            // Error is handled by the AuthContext
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            type="login"
            onSubmit={handleLogin}
            loading={loading}
            error={error}
        />
    );
};

export default Login;