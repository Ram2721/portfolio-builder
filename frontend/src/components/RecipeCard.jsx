import React from 'react';

const RecipeCard = ({ recipe, onEdit, onDelete, onSave, isLocal }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{recipe.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {recipe.instructions}
                </p>

                <div className="flex gap-2 mt-auto">
                    {isLocal ? (
                        <>
                            <button
                                onClick={() => onEdit(recipe)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(recipe.id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onSave(recipe)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            Save to My Recipes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
