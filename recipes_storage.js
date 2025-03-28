async function loadRecipes(cuisine) {
    try {
        const response = await fetch('recipes.json'); 
        const data = await response.json();
        const cuisineRecipes = data[cuisine];

        console.log('Loaded recipes:', cuisineRecipes); 

        const categories = Object.keys(cuisineRecipes); 

        const categorySections = document.querySelectorAll('.category');
        categorySections.forEach(categorySection => {
            const categoryHeading = categorySection.querySelector('h2');
            if (categoryHeading) {
                const categoryName = categoryHeading.textContent.toLowerCase();
                if (categories.includes(categoryName)) {
                    const mealContainer = categorySection.querySelector('.meal-container') || document.createElement('div');
                    mealContainer.classList.add('meal-container');
                    mealContainer.innerHTML = '';

                    cuisineRecipes[categoryName].forEach(recipe => {
                        const mealDiv = document.createElement('div');
                        mealDiv.classList.add('meal');
                        mealDiv.innerHTML = `
                            <img src="${recipe.image}" alt="${recipe.name}" class="square-photo">
                            <h3>${recipe.name}</h3>
                            <p>${recipe.description}</p>
                            <div class="popup">
                                <h3>${recipe.name} Recipe</h3>
                                <p><strong>Ingredients:</strong></p>
                                <ul>
                                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                                </ul>
                                <p><strong>Instructions:</strong></p>
                                <ol>
                                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        `;
                        mealContainer.appendChild(mealDiv);
                    });

                    categorySection.appendChild(mealContainer);
                }
            }
        });
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}


const cuisine = window.location.pathname.split('/').pop().split('.')[0];

loadRecipes(cuisine);