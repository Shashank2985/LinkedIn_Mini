import React, { useState } from 'react';

const CreatePostForm = ({ onCreate, loading }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onCreate({ content });
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
            <textarea
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="What's on your mind?"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? 'Posting...' : 'Post'}
            </button>
        </form>
    );
};

export default CreatePostForm;
