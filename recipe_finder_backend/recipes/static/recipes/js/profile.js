document.addEventListener('DOMContentLoaded', function () {
    const profileImage = document.getElementById('profile-avatar');
    const usernameDisplay = document.getElementById('profile-username');
    const savedImage = localStorage.getItem('profileImage');
    const savedUsername = localStorage.getItem('username');

    if (savedImage) profileImage.src = savedImage;
    if (savedUsername) usernameDisplay.textContent = savedUsername;

    loadFavoriteRecipes();
});

async function loadFavoriteRecipes() {
    const token = sessionStorage.getItem('token');
    const carouselInner = document.querySelector(".carousel-inner");
    carouselInner.innerHTML = "";

    try {
        const response = await fetch('http://localhost:8000/api/favorites/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        if (!response.ok) {
            carouselInner.innerHTML = "<p>No favorite recipes yet.</p>";
            return;
        }
        const favorites = await response.json();
    if (favorites.length === 0) {
        carouselInner.innerHTML = "<p>No favorite recipes yet.</p>";
        return;
    }
        favorites.forEach((favorite, index) => {
            const recipe = favorite.recipe;
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
        carouselItem.innerHTML = `
                <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image">
                <p>${recipe.title}</p>
            <div class="popup">
                    <h3>${recipe.title} Recipe</h3>
                <p><strong>Description:</strong> ${recipe.description}</p>
                <p><strong>Ingredients:</strong></p>
                    <ul>${recipe.ingredients.split('\n').map(ing => `<li>${ing}</li>`).join("")}</ul>
                <p><strong>Instructions:</strong></p>
                    <ol>${recipe.instructions.split('\n').map(step => `<li>${step}</li>`).join("")}</ol>
            </div>
        `;
        carouselInner.appendChild(carouselItem);
    });
    setupCarousel();
    } catch (error) {
        console.error('Error loading favorite recipes:', error);
        carouselInner.innerHTML = "<p>Error loading favorite recipes.</p>";
    }
}

function setupCarousel() {
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    if (items.length > 0) {
        items[0].style.display = 'block';
    }

    window.moveCarousel = function (direction) {
        items[currentIndex].style.display = 'none';

        currentIndex += direction;
        if (currentIndex >= totalItems) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalItems - 1;

        items[currentIndex].style.display = 'block';
    };
}
