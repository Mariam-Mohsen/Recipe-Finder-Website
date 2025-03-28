document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-recipe-form");
    const ingredientList = document.getElementById("ingredients-list");
    const addIngredientButton = document.getElementById("add-ingredient");
    const instructionsList = document.getElementById("instructions-list");
    const addInstructionButton = document.getElementById("add-instruction");

    // 🛠 Add Ingredient Logic
    addIngredientButton.addEventListener("click", function () {
        const div = document.createElement("div");
        div.classList.add("ingredient");
        div.innerHTML = `
            <input type="text" name="ingredient-name[]" placeholder="Ingredient Name" required>
            <input type="text" name="quantity[]" placeholder="Quantity" required>
            <button type="button" class="remove-ingredient">Remove</button>
        `;
        ingredientList.appendChild(div);
    });

    ingredientList.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-ingredient")) {
            event.target.parentElement.remove();
        }
    });

    // 🛠 Add Instruction Step Logic
    addInstructionButton.addEventListener("click", function () {
        const div = document.createElement("div");
        div.classList.add("instruction");
        div.innerHTML = `
            <input type="text" name="instruction-step[]" placeholder="Next Step" required>
            <button type="button" class="remove-instruction">Remove</button>
        `;
        instructionsList.appendChild(div);
    });

    instructionsList.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-instruction")) {
            event.target.parentElement.remove();
        }
    });

    // 🛠 Submit Form
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const recipeID = document.getElementById("recipe-ID").value;
        const recipeName = document.getElementById("recipe-name").value;
        const courseType = document.getElementById("course-type").value;
        const description = document.getElementById("description").value;
        const imageFile = document.getElementById("image").files[0];

        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function () {
            const imageBase64 = reader.result;

            // ✅ Extract Ingredients
            const ingredients = [];
            document.querySelectorAll("#ingredients-list .ingredient").forEach(ingredient => {
                const name = ingredient.querySelector("[name='ingredient-name[]']").value;
                const quantity = ingredient.querySelector("[name='quantity[]']").value;
                ingredients.push(`${quantity} ${name}`);
            });

            // ✅ Extract Instructions
            const instructions = [];
            document.querySelectorAll("#instructions-list .instruction input").forEach(step => {
                instructions.push(step.value);
            });

            const newRecipe = {
                id: recipeID,
                name: recipeName,
                image: imageBase64,  // 🔥 Store image as Base64
                description: description,
                ingredients: ingredients,
                instructions: instructions
            };

            // 🔥 Correct courseType mapping
            const courseTypeMap = {
                "appetizer": { storageKey: "appetizers", page: "appetizer.html" },
                "soup": { storageKey: "soups", page: "soup.html" },
                "main-course": { storageKey: "main_dishes", page: "main_dish.html" },
                "dessert": { storageKey: "dessert", page: "dessert.html" }
            };

            const mappedData = courseTypeMap[courseType];

            if (!mappedData) {
                alert("Invalid course type selected.");
                return;
            }

            const { storageKey, page } = mappedData;

            // ✅ Save to "recipes"
            let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};
            if (!storedRecipes[storageKey]) {
                storedRecipes[storageKey] = [];
            }
            storedRecipes[storageKey].push(newRecipe);
            localStorage.setItem("recipes", JSON.stringify(storedRecipes));

            // ✅ Save to "recipesData"
            let recipesData = JSON.parse(localStorage.getItem("recipesData")) || {};
            if (!recipesData[storageKey]) {
                recipesData[storageKey] = [];
            }
            recipesData[storageKey].push(newRecipe);
            localStorage.setItem("recipesData", JSON.stringify(recipesData));

            alert("Recipe added successfully!");

            // ✅ Redirect to the correct page
            window.location.href = page;
        };
    });
});
