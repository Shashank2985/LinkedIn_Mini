import React, { useState } from 'react';

const EditProfileForm = ({ user, onSave, loading }) => {
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, bio });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    className="mt-1 block w-full border rounded px-3 py-2"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                    className="mt-1 block w-full border rounded px-3 py-2"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
};

export default EditProfileForm;
