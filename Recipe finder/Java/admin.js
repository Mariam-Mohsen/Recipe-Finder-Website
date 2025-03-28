let currentEditIndex = null;
let currentEditCategory = null;
let currentDeleteIndex = null;
let currentDeleteCategory = null;

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
  }
  else if (document.getElementById("soups-container")) {
    containerId = "soups-container";
    categoryKey = "soups";
  }
  else if (document.getElementById("appetizers-container")) {
    containerId = "appetizers-container";
    categoryKey = "appetizers";
  }
  else if (document.getElementById("desserts-container")) {
    containerId = "desserts-container";
    categoryKey = "dessert";
  }

  if (!containerId || !categoryKey) {
    console.error("No known container found in the HTML.");
    return;
  }

  const recipeContainer = document.getElementById(containerId);
  recipeContainer.innerHTML = "";

  const recipesData = JSON.parse(localStorage.getItem("recipesData")) || {};
  const recipes = recipesData[categoryKey] || [];

  if (recipes.length === 0) {
    recipeContainer.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  recipes.forEach((recipe, index) => {
    const recipeItem = document.createElement("div");
    recipeItem.classList.add("recipe-item");
    recipeItem.innerHTML = `
      <details>
        <summary>
          <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
          <h3>${recipe.name}</h3>
          ${recipe.cuisine ? `<span class="cuisine-tag">${recipe.cuisine}</span>` : ''}
          <div class="recipe-actions">
            <a href="#editPopup" onclick="openEditPopup('${categoryKey}', ${index})">Edit</a>
            <a href="#deletePopup" onclick="openDeletePopup('${categoryKey}', ${index})">Delete</a>
          </div>
        </summary>
        <div class="recipe-details">
          <h4>Description:</h4>
          <p>${recipe.description}</p>
          <h4>Ingredients:</h4>
          <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
          <h4>Instructions:</h4>
          <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join("")}</ol>
        </div>
      </details>
    `;
    recipeContainer.appendChild(recipeItem);
  });
}

function openEditPopup(category, index) {
  const recipesData = JSON.parse(localStorage.getItem("recipesData"));
  const recipe = recipesData[category][index];

  document.getElementById("editName").value = recipe.name;
  document.getElementById("editDescription").value = recipe.description;
  document.getElementById("editIngredients").value = recipe.ingredients.join("\n");
  document.getElementById("editInstructions").value = recipe.instructions.join("\n");

  currentEditCategory = category;
  currentEditIndex = index;
  document.getElementById("editPopupOverlay").style.display = "block";
  document.getElementById("editPopup").style.display = "block";
}


function closeEditPopup() {
  document.getElementById("editPopupOverlay").style.display = "none";
  document.getElementById("editPopup").style.display = "none";
}


document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const recipesData = JSON.parse(localStorage.getItem("recipesData"));
  const recipe = recipesData[currentEditCategory][currentEditIndex];

  recipe.name = document.getElementById("editName").value;
  recipe.description = document.getElementById("editDescription").value;
  recipe.ingredients = document.getElementById("editIngredients").value.split("\n");
  recipe.instructions = document.getElementById("editInstructions").value.split("\n");


  localStorage.setItem("recipesData", JSON.stringify(recipesData));
  console.log("Updated Recipe:", recipe);
  loadRecipes();
  closeEditPopup();
});


function openDeletePopup(category, index) {
  currentDeleteCategory = category;
  currentDeleteIndex = index;
  document.getElementById("deletePopupOverlay").style.display = "block";
  document.getElementById("deletePopup").style.display = "block";
}


function closeDeletePopup() {
  document.getElementById("deletePopupOverlay").style.display = "none";
  document.getElementById("deletePopup").style.display = "none";
}


function confirmDelete() {
  const recipesData = JSON.parse(localStorage.getItem("recipesData"));
  recipesData[currentDeleteCategory].splice(currentDeleteIndex, 1);
  localStorage.setItem("recipesData", JSON.stringify(recipesData));
  console.log("Updated Recipes:", recipesData[currentDeleteCategory]);
  loadRecipes();
  closeDeletePopup();
}

window.onload = initializeRecipes;
