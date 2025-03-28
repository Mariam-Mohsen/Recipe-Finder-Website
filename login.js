document.addEventListener('DOMContentLoaded', function() {
    const adminCheckbox = document.getElementById("login-admin");
    const adminIdField = document.getElementById("admin-id-field");
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    // Toggle Admin ID field visibility
    adminCheckbox.addEventListener("change", function() {
        adminIdField.style.display = this.checked ? "block" : "none";
    });

    // Handle form submission
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const isAdmin = adminCheckbox.checked;
        const adminId = document.getElementById("admin-id").value.trim();

        // Reset error message
        errorMessage.style.display = "none";

        // Validation
        if (username === "" || password === "") {
            showError("Please fill in all required fields.");
            return;
        }

        if (isAdmin && adminId === "") {
            showError("Please enter your Admin ID.");
            return;
        }

        // Redirect based on user type
        redirectUser(isAdmin);
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    function redirectUser(isAdmin) {
        if (isAdmin) {
            window.location.href = "recipe_admin.html";
        } else {
            window.location.href = "User_main_dish.html";
        }
    }
});