import React, { use, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import EditProfileForm from '../components/EditProfileForm';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { user, setUser } = useContext(useAuth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const handleSave = async (data) => {
        setLoading(true);
        setError('');
        try {
            const res = await usersAPI.updateProfile(data);
            setUser(res);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <EditProfileForm user={user} onSave={handleSave} loading={loading} />
            </div>
        </div>
    );
};

export default EditProfile;
