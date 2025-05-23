let currentRecipe = null;

// Fetch recipes from backend
async function fetchRecipesFromBackend(categoryKey) {
  const token = sessionStorage.getItem("token");
  let url = `http://localhost:8000/api/recipes/?root_category=${encodeURIComponent(categoryKey)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` }
  });

  if (!response.ok) throw new Error("Failed to fetch recipes.");
  return await response.json();
}

// Load recipes dynamically based on which container exists
async function loadRecipes() {
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

  if (!containerId || !categoryKey) {
    console.error("No known container found in the HTML.");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  try {
    const recipes = await fetchRecipesFromBackend(categoryKey);

    if (recipes.length === 0) {
      container.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    recipes.forEach((recipe) => {
      const div = document.createElement("div");
      div.classList.add("recipe-item");
      div.innerHTML = `
        <details>
          <summary>
            <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image">
            <h3>${recipe.title}</h3>
            ${recipe.cuisine ? `<span class="cuisine-tag">${recipe.cuisine.name}</span>` : ''}
            <div class="recipe-actions">
              <a href="#" onclick="openEditPopup(${recipe.id})">Edit</a>
              <a href="#" onclick="openDeletePopup(${recipe.id})">Delete</a>
            </div>
          </summary>
          <div class="recipe-details">
            <h4>Description:</h4>
            <p>${recipe.description}</p>
            <h4>Ingredients:</h4>
            <ul>${recipe.ingredients.split("\n").map(ing => `<li>${ing}</li>`).join("")}</ul>
            <h4>Instructions:</h4>
            <ol>${recipe.instructions.split("\n").map(step => `<li>${step}</li>`).join("")}</ol>
          </div>
        </details>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Popups

function openEditPopup(recipeId) {
  fetch(`http://localhost:8000/api/recipes/${recipeId}/`, {
    headers: { Authorization: `Token ${sessionStorage.getItem("token")}` }
  })
    .then(res => res.json())
    .then(recipe => {
      currentRecipe = recipe;

      document.getElementById("editName").value = recipe.title;
      document.getElementById("editDescription").value = recipe.description;
      document.getElementById("editIngredients").value = recipe.ingredients;
      document.getElementById("editInstructions").value = recipe.instructions;

      document.getElementById("editPopupOverlay").style.display = "block";
      document.getElementById("editPopup").style.display = "block";
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load recipe for editing.");
    });
}

function closeEditPopup() {
  document.getElementById("editPopupOverlay").style.display = "none";
  document.getElementById("editPopup").style.display = "none";
}

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!currentRecipe) return;

  const updated = {
    title: document.getElementById("editName").value,
    description: document.getElementById("editDescription").value,
    ingredients: document.getElementById("editIngredients").value,
    instructions: document.getElementById("editInstructions").value
  };

  try {
    const response = await fetch(`http://localhost:8000/api/recipes/${currentRecipe.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`
      },
      body: JSON.stringify(updated)
    });

    if (!response.ok) throw new Error("Update failed");

    alert("✅ Recipe updated.");
    closeEditPopup();
    loadRecipes();
  } catch (err) {
    console.error(err);
    alert("❌ Could not update recipe.");
  }
});

function openDeletePopup(recipeId) {
  currentRecipe = { id: recipeId };
  document.getElementById("deletePopupOverlay").style.display = "block";
  document.getElementById("deletePopup").style.display = "block";
}

function closeDeletePopup() {
  document.getElementById("deletePopupOverlay").style.display = "none";
  document.getElementById("deletePopup").style.display = "none";
}

function confirmDelete() {
  if (!currentRecipe) return;

  fetch(`http://localhost:8000/api/recipes/${currentRecipe.id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${sessionStorage.getItem("token")}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("Delete failed");
      alert("✅ Recipe deleted.");
      closeDeletePopup();
      loadRecipes();
    })
    .catch(error => {
      console.error(error);
      alert("❌ Could not delete recipe.");
    });
}

// Load on start
window.onload = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  loadRecipes();
};
