async function loadRecipes(cuisine) {
  try {
    const response = await fetch(`http://localhost:8000/api/recipes/?cuisine=${encodeURIComponent(cuisine)}`);
    const recipes = await response.json();
    console.log('Loaded recipes:', recipes);

    // Group recipes by subcategory name
    const cuisineRecipes = {};
    recipes.forEach(recipe => {
      const category = recipe.subcategory?.name?.toLowerCase() || "uncategorized";
      if (!cuisineRecipes[category]) cuisineRecipes[category] = [];
      cuisineRecipes[category].push(recipe);
    });

    const categorySections = document.querySelectorAll('.category');
    categorySections.forEach(categorySection => {
      const categoryName = categorySection.dataset.category;
      const recipesInCategory = cuisineRecipes[categoryName];
      if (recipesInCategory) {
        const mealContainer = categorySection.querySelector('.meal-container');
        mealContainer.innerHTML = '';

        recipesInCategory.forEach(recipe => {
          const mealDiv = document.createElement('div');
          mealDiv.classList.add('meal');
          mealDiv.innerHTML = `
            <img src="${recipe.image_url}" alt="${recipe.title}" class="square-photo">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <div class="popup">
              <h3>${recipe.title} Recipe</h3>
              <p><strong>Ingredients:</strong></p>
              <ul>${recipe.ingredients.split('\n').map(ing => `<li>${ing}</li>`).join('')}</ul>
              <p><strong>Instructions:</strong></p>
              <ol>${recipe.instructions.split('\n').map(step => `<li>${step}</li>`).join('')}</ol>
            </div>
          `;
          mealContainer.appendChild(mealDiv);
        });
      }
    });
  } catch (error) {
    console.error('Error loading recipes:', error);
  }
}

// Auto-detect cuisine from file name
const cuisine = window.location.pathname.split('/').pop().split('.')[0];
loadRecipes(cuisine);
