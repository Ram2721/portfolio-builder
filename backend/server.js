const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let recipes = [
    {
        id: 1,
        name: "Spaghetti Carbonara",
        image: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
        instructions: "Cook pasta. Fry bacon. Mix eggs and cheese. Combine."
    },
    {
        id: 2,
        name: "Chicken Curry",
        image: "https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg",
        instructions: "Fry spices. Add chicken. Simmer with coconut milk."
    }
];

// ROUTES

// GET all recipes
app.get('/api/recipes', (req, res) => {
    res.json(recipes);
});

// GET single recipe
app.get('/api/recipes/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
});

// POST new recipe
app.post('/api/recipes', (req, res) => {
    const { name, image, instructions } = req.body;
    if (!name || !image) {
        return res.status(400).json({ message: "Name and Image are required" });
    }

    const newRecipe = {
        id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
        name,
        image,
        instructions: instructions || ""
    };

    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
});

// PUT update recipe
app.put('/api/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recipes.findIndex(r => r.id === id);

    if (index === -1) return res.status(404).json({ message: "Recipe not found" });

    const { name, image, instructions } = req.body;
    
    recipes[index] = {
        ...recipes[index],
        name: name || recipes[index].name,
        image: image || recipes[index].image,
        instructions: instructions || recipes[index].instructions
    };

    res.json(recipes[index]);
});

// DELETE recipe
app.delete('/api/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    recipes = recipes.filter(r => r.id !== id);
    res.json({ message: "Recipe deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
