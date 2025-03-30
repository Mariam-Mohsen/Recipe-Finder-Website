function initializeRecipes() {
    if (!localStorage.getItem("recipesData")) {
        fetch("../recipes.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem("recipesData", JSON.stringify(data));
                syncFavorites();
                loadRecipes();
            })
            .catch(error => {
                console.error("Error loading JSON file:", error);
            });
    } else {
        syncFavorites();
        loadRecipes();
    }
}

function loadRecipes() {
    let containerId = null;
    let categoryKey = null;

    if (document.getElementById("recipe-container")) {
        containerId = "recipe-container";
        categoryKey = "main_dishes";
    } else if (document.getElementById("soups-container")) {
        containerId = "soups-container";
        categoryKey = "soups";
    } else if (document.getElementById("appetizers-container")) {
        containerId = "appetizers-container";
        categoryKey = "appetizers";
    } else if (document.getElementById("desserts-container")) {
        containerId = "desserts-container";
        categoryKey = "dessert";
    }

    if (containerId && categoryKey) {
        const recipesData = JSON.parse(localStorage.getItem("recipesData"));
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        if (recipesData && Array.isArray(recipesData[categoryKey])) {
            const favoriteRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

            recipesData[categoryKey].forEach(recipe => {
                const isFavorite = favoriteRecipes.some(fav => fav.id === recipe.id);
                const recipeElement = document.createElement("div");
                recipeElement.classList.add("recipe-container");

                recipeElement.innerHTML = `
                    <div class="recipe-image">
                        <img src="${recipe.image}" alt="${recipe.name}" />
                    </div>
                    <div class="recipe-content">
                        <h2>${recipe.name}</h2>
                        <button class="favorite-btn" data-recipe-id="${recipe.id}">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                        <div class="ingredients">
                            <h3>Ingredients:</h3>
                            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
                        </div>
                        <div class="instructions">
                            <h3>Instructions:</h3>
                            <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join("")}</ol>
                        </div>
                    </div>
                `;

                container.appendChild(recipeElement);
            });
        }
        addFavoriteButtonListeners();
    }
}

function addFavoriteButtonListeners() {
    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", function () {
            const recipeId = this.getAttribute("data-recipe-id");
            toggleFavorite(recipeId, this);
        });
    });
}

function toggleFavorite(recipeId, button) {
    const recipesData = JSON.parse(localStorage.getItem("recipesData"));
    let favoriteRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

    // Find the recipe in any category
    let recipe = null;
    for (const category in recipesData) {
        if (Array.isArray(recipesData[category])) {
            recipe = recipesData[category].find(r => r.id === recipeId);
            if (recipe) break;
        }
    }

    if (!recipe) return;

    const index = favoriteRecipes.findIndex(fav => fav.id === recipeId);
    if (index === -1) {
        favoriteRecipes.push(recipe);
        button.textContent = '❤️';
    } else {
        favoriteRecipes.splice(index, 1);
        button.textContent = '🤍';
    }

    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
}

function syncFavorites() {
    const recipesData = JSON.parse(localStorage.getItem("recipesData"));
    let favoriteRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

    if (!recipesData) return;

    const allRecipes = {};
    for (const category in recipesData) {
        if (Array.isArray(recipesData[category])) {
            recipesData[category].forEach(recipe => {
                allRecipes[recipe.id] = recipe;
            });
        } else {
            console.warn(`Category "${category}" is not an array. Skipped.`, recipesData[category]);
        }
    }

    const updatedFavorites = [];
    favoriteRecipes.forEach(fav => {
        if (allRecipes[fav.id]) {
            updatedFavorites.push(allRecipes[fav.id]);
        }
    });

    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
}

document.addEventListener("DOMContentLoaded", initializeRecipes);
