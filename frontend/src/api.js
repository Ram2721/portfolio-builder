import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes';
const ONLINE_API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export const getRecipes = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createRecipe = async (recipe) => {
    const response = await axios.post(API_URL, recipe);
    return response.data;
};

export const updateRecipe = async (id, recipe) => {
    const response = await axios.put(`${API_URL}/${id}`, recipe);
    return response.data;
};

export const deleteRecipe = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const searchOnlineRecipes = async (query) => {
    const response = await axios.get(`${ONLINE_API_URL}${query}`);
    return response.data.meals || [];
};
