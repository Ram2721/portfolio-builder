import React, { useState, useEffect } from 'react';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, searchOnlineRecipes } from './api';
import RecipeCard from './components/RecipeCard';
import RecipeForm from './components/RecipeForm';

function App() {
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [localRecipes, setLocalRecipes] = useState([]);
  const [onlineRecipes, setOnlineRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocalRecipes();
  }, []);

  const fetchLocalRecipes = async () => {
    try {
      const data = await getRecipes();
      setLocalRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (activeTab === 'search') {
      if (!searchQuery.trim()) return;
      setLoading(true);
      try {
        const results = await searchOnlineRecipes(searchQuery);
        setOnlineRecipes(results ? results.map(r => ({
          id: r.idMeal,
          name: r.strMeal,
          image: r.strMealThumb,
          instructions: r.strInstructions ? r.strInstructions.slice(0, 200) + '...' : 'No instructions available.'
        })) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreate = async (data) => {
    try {
      const newRecipe = await createRecipe(data);
      setLocalRecipes([...localRecipes, newRecipe]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      if (!editingRecipe) return;
      const updated = await updateRecipe(editingRecipe.id, data);
      setLocalRecipes(localRecipes.map(r => r.id === editingRecipe.id ? updated : r));
      setEditingRecipe(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      setLocalRecipes(localRecipes.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleSaveOnline = async (recipe) => {
    // Save to local
    try {
      const newRecipeData = {
        name: recipe.name,
        image: recipe.image,
        instructions: recipe.instructions
      };
      await handleCreate(newRecipeData);
      alert("Recipe saved to My Recipes!");
      setActiveTab('my-recipes');
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const openAddModal = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  // Filter local recipes based on search query if in my-recipes tab
  const displayedLocalRecipes = activeTab === 'my-recipes'
    ? localRecipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : localRecipes;

  return (
    <div className="min-h-screen font-sans text-gray-900">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-orange-500 to-red-600 shadow-lg text-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-4 md:mb-0">
            🥘 Recipe App
          </h1>

          <div className="flex bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('my-recipes')}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === 'my-recipes' ? 'bg-white text-orange-600 font-bold shadow-sm' : 'hover:bg-white/10'}`}
            >
              My Recipes
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === 'search' ? 'bg-white text-orange-600 font-bold shadow-sm' : 'hover:bg-white/10'}`}
            >
              Search Online
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* Search Bar & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          <form onSubmit={handleSearch} className="w-full md:w-1/2 flex gap-2">
            <input
              type="text"
              placeholder={activeTab === 'my-recipes' ? "Filter my recipes..." : "Search for online recipes (e.g. Pasta)..."}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {activeTab === 'search' && (
              <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Search
              </button>
            )}
          </form>

          {activeTab === 'my-recipes' && (
            <button
              onClick={openAddModal}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-md flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              ➕ Add New Recipe
            </button>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading deliciousness...</p>
          </div>
        ) : (
          <>
            {activeTab === 'search' && onlineRecipes.length === 0 && searchQuery && !loading && (
              <div className="text-center text-gray-500 mt-10">No online recipes found for "{searchQuery}".</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeTab === 'my-recipes' ? (
                displayedLocalRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isLocal={true}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                onlineRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isLocal={false}
                    onSave={handleSaveOnline}
                  />
                ))
              )}
            </div>

            {activeTab === 'my-recipes' && displayedLocalRecipes.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p className="text-xl">Your recipe book is empty!</p>
                <p>Click "Add New Recipe" or "Search Online" to get started.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {isFormOpen && (
        <RecipeForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingRecipe ? handleUpdate : handleCreate}
          initialData={editingRecipe}
        />
      )}
    </div>
  );
}

export default App;
