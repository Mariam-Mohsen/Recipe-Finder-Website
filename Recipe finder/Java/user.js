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
                loadRecipes();
            })
            .catch(error => {
                console.error("Error loading JSON file:", error);
            });
    } else {
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

        if (recipesData && recipesData[categoryKey]) {
            recipesData[categoryKey].forEach(recipe => {
                const recipeElement = document.createElement("div");
                recipeElement.classList.add("recipe-container");
                recipeElement.innerHTML = `
                    <div class="recipe-image">
                        <img src="${recipe.image}" alt="${recipe.name}" />
                    </div>
                    <div class="recipe-content">
                        <h2>${recipe.name}</h2>
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
    }
}

document.addEventListener("DOMContentLoaded", initializeRecipes);
