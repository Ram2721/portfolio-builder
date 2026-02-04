let form=document.querySelector("form")
form.addEventListener("submit",(e)=>{
    e.preventDefault()
    let recipe_name=document.getElementById("search_recipe").value
    let fetchRecipes=async()=>{
        let recipes=await fetch(`https:www.themealdb.com/api/json/v1/1/search.php?s=${recipe_name}`);
        let finalRecipedata=await recipes.json();
        console.log( finalRecipedata.meals)
        let container=document.getElementById("container");
        container.innerHTML=``
        finalRecipedata.meals.forEach(element => {
            container.innerHTML+=`
            <div id="recipe_item">
            <img src=${element.strMealThumb} id="food_img">
            <h2 id="recipe_name">${element.strMeal}</h2>
            <button id="view_recipe">View Recipe</button>
            </div>
            `

            
        })
    }
    fetchRecipes()

})