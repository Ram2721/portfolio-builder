import React, { useState, useEffect } from 'react';

const RecipeForm = ({ onSubmit, onClose, initialData }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [instructions, setInstructions] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setImage(initialData.image);
            setInstructions(initialData.instructions);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, image, instructions });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Recipe' : 'Add New Recipe'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Recipe Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Chocolate Cake"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Image URL</label>
                        <input
                            type="url"
                            required
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Instructions</label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Step 1..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        {initialData ? 'Update Recipe' : 'Add Recipe'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RecipeForm;
