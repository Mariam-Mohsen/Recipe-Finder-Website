document.addEventListener('DOMContentLoaded', function () {
    const profileImage = document.getElementById('profile-avatar');
    const usernameDisplay = document.getElementById('profile-username');
    const savedImage = localStorage.getItem('profileImage');
    const savedUsername = localStorage.getItem('username');

    if (savedImage) profileImage.src = savedImage;
    if (savedUsername) usernameDisplay.textContent = savedUsername;

    loadFavoriteRecipes();
});

function loadFavoriteRecipes() {
    const favorites = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    const carouselInner = document.querySelector(".carousel-inner");
    carouselInner.innerHTML = "";

    if (favorites.length === 0) {
        carouselInner.innerHTML = "<p>No favorite recipes yet.</p>";
        return;
    }

    favorites.forEach((recipe, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

        carouselItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <p>${recipe.name}</p>
            <div class="popup">
                <h3>${recipe.name} Recipe</h3>
                <p><strong>Description:</strong> ${recipe.description}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
                <p><strong>Instructions:</strong></p>
                <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join("")}</ol>
            </div>
        `;

        carouselInner.appendChild(carouselItem);
    });

    setupCarousel();
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
