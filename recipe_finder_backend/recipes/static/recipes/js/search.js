document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const fullRecipeView = document.getElementById("fullRecipeView");
  const fullRecipeContent = document.getElementById("fullRecipeContent");

  // Search when Enter is pressed
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const searchTerm = this.value.trim();

      if (searchTerm.length === 0) {
        closeFullRecipe();
        return;
      }

      showLoading();
      performSearch(searchTerm.toLowerCase());
    }
  });

  // Close when clicking outside
  fullRecipeView.addEventListener("click", function (e) {
    if (e.target === this) {
      closeFullRecipe();
    }
  });

  function showLoading() {
    fullRecipeView.style.display = "block";
    fullRecipeContent.innerHTML = '<p class="loading">Searching recipes...</p>';
    fullRecipeView.classList.add("active");
    document.body.classList.add("modal-open");
  }

  async function performSearch(searchTerm) {
    try {
      // Fetch all recipes from backend
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/recipes/?search=' + encodeURIComponent(searchTerm), {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const recipes = await response.json();

      let foundRecipes = recipes.filter(recipe => recipeMatches(recipe, searchTerm));

      if (foundRecipes.length > 0) {
        displayFullRecipes(foundRecipes, searchTerm);
      } else {
        showNoResults(`No recipes found matching "${searchTerm}"`);
      }
    } catch (error) {
      console.error("Search error:", error);
      showNoResults("Error searching recipes. Please try again.");
    }
  }

  function recipeMatches(recipe, searchTerm) {
    const nameMatch = recipe.title.toLowerCase().includes(searchTerm);
    const ingredientsMatch = recipe.ingredients.toLowerCase().includes(searchTerm);
    return nameMatch || ingredientsMatch;
  }

  function displayFullRecipes(recipes, searchTerm) {
    fullRecipeContent.innerHTML = recipes
      .map((recipe) => {
        const highlightedName = highlightText(recipe.title, searchTerm);
        const highlightedDesc = recipe.description
          ? highlightText(recipe.description, searchTerm)
          : "";
        const highlightedIngredients = recipe.ingredients
          .split('\n')
          .map((ing) => highlightText(ing, searchTerm));

        return `
          <div class="recipe-card">
            <div class="recipe-image">
              <img src="${recipe.image_url}" alt="${recipe.title}">
            </div>
            <h2>${highlightedName}</h2>
            ${
              recipe.description
                ? `<p class="description">${highlightedDesc}</p>`
                : ""
            }
            <div class="ingredients">
              <h3>Ingredients</h3>
              <ul>
                ${highlightedIngredients.map((ing) => `<li>${ing}</li>`).join("")}
              </ul>
            </div>
            <div class="instructions">
              <h3>Instructions</h3>
              <ol>
                ${recipe.instructions
                  .split('\n')
                  .map((step) => `<li>${step}</li>`)
                  .join("")}
              </ol>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function highlightText(text, term) {
    if (!term) return text;
    return text.replace(
      new RegExp(term, "gi"),
      (match) => `<span class="search-highlight">${match}</span>`
    );
  }

  function showNoResults(message) {
    fullRecipeContent.innerHTML = `<p class="no-results">${message}</p>`;
  }

  window.closeFullRecipe = function () {
    fullRecipeView.classList.remove("active");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
      fullRecipeView.style.display = "none";
      fullRecipeContent.innerHTML = "";
    }, 300);
  };
});
