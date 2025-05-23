("DOMContentLoaded", function () {
  const form = document.getElementById("add-recipe-form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const recipeId = document.getElementById("recipe-ID").value.trim();
    const recipeName = document.getElementById("recipe-name").value.trim();
    const courseType = document.getElementById("course-type").value;
    const description = document.getElementById("description").value.trim();
    const imageUrl = document.getElementById("image-url").value.trim();

    if (!recipeId) {
      alert("Recipe ID is required.");
      return;
    }



    const ingredients = [];
    document.querySelectorAll("#ingredients-list .ingredient").forEach(ingredient => {
      const name = ingredient.querySelector("[name='ingredient-name[]']").value.trim();
      const quantity = ingredient.querySelector("[name='quantity[]']").value.trim();
      if (name && quantity) {
        ingredients.push(`${quantity} ${name}`);
      }
    });

    const instructions = [];
    document.querySelectorAll("#instructions-list .instruction input").forEach(step => {
      const value = step.value.trim();
      if (value) instructions.push(value);
    });

    const ingredientsText = ingredients.join("\n");
    const instructionsText = instructions.join("\n");

    const courseTypeToRootCategory = {
      "main-course": { id: 1, page: "main_dish.html" },
      "soup": { id: 2, page: "soup.html" },
      "appetizer": { id: 3, page: "appetizer.html" },
      "dessert": { id: 4, page: "dessert.html" }
    };

    const mapped = courseTypeToRootCategory[courseType];
    if (!mapped) {
      alert("Invalid course type selected.");
      return;
    }

    const data = {
      custom_id: recipeId,
      title: recipeName,
      description: description,
      ingredients: ingredientsText,
      instructions: instructionsText,
      image_url: imageUrl,
      root_category: mapped.id 
    };

    try {
      const response = await fetch("http://localhost:8000/api/recipes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.custom_id?.[0]?.includes("already exists")) {
          alert("This Recipe ID already exists.");
        } else if (err.root_category_id) {
          alert("Root category is required.");
        } else {
          alert("Failed to add recipe:\n" + JSON.stringify(err));
        }
        return;
      }

      alert("Recipe added successfully!");
      window.location.href = mapped.page;
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Network error. Please try again.");
    }
  });
});
