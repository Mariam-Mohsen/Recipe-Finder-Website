async function loadRecipesFromBackend(rootCategoryId, containerId) {
  try {
    const response = await fetch(`http://localhost:8000/api/recipes/?root_category=${rootCategoryId}`);
    const recipes = await response.json();

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const favorites = getFavorites();

    recipes.forEach(recipe => {
      const isFavorite = favorites.some(fav => fav.id === recipe.id);

      const recipeElement = document.createElement("div");
      recipeElement.classList.add("recipe-container");

      recipeElement.innerHTML = `
        <div class="recipe-image">
          <img src="${recipe.image_url}" alt="${recipe.title}" />
        </div>
        <div class="recipe-content">
          <h2>${recipe.title}</h2>
          <button class="favorite-btn" data-recipe-id="${recipe.id}">
            ${isFavorite ? '❤️' : '🤍'}
          </button>
          <div class="ingredients">
            <h3>Ingredients:</h3>
            <ul>${recipe.ingredients.split('\n').map(ing => `<li>${ing}</li>`).join("")}</ul>
          </div>
          <div class="instructions">
            <h3>Instructions:</h3>
            <ol>${recipe.instructions.split('\n').map(step => `<li>${step}</li>`).join("")}</ol>
          </div>
        </div>
      `;

      container.appendChild(recipeElement);
    });

    addFavoriteButtonListeners();
  } catch (error) {
    console.error("Error loading recipes:", error);
  }
}

function getFavorites() {
  const favs = localStorage.getItem("favoriteRecipes");
  return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favs) {
  localStorage.setItem("favoriteRecipes", JSON.stringify(favs));
}

function addFavoriteButtonListeners() {
  document.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", () => {
      const recipeId = parseInt(button.getAttribute("data-recipe-id"));
      let favorites = getFavorites();
      const index = favorites.findIndex(f => f.id === recipeId);

      if (index !== -1) {
        favorites.splice(index, 1);
        button.textContent = '🤍';
      } else {
        const title = button.parentElement.querySelector("h2").textContent;
        favorites.push({ id: recipeId, title });
        button.textContent = '❤️';
      }

      saveFavorites(favorites);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.toLowerCase();
  if (page.includes("main_dish")) loadRecipesFromBackend(1, "recipe-container");
  else if (page.includes("soup")) loadRecipesFromBackend(2, "soups-container");
  else if (page.includes("appetizers")) loadRecipesFromBackend(3, "appetizers-container");
  else if (page.includes("dessert")) loadRecipesFromBackend(4, "desserts-container");
});
