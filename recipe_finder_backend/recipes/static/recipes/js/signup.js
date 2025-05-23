document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const isAdmin = document.getElementById("is-admin").checked;

  const data = {
    username,
    email,
    password,
    password2,
    is_staff: isAdmin
  };

  try {
    const response = await fetch("http://localhost:8000/api/auth/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Signup failed.");
      return;
    }

    alert(result.message || "Signup successful!");
    if (isAdmin) {
      window.location.href = "recipe_admin.html";
    } else {
      window.location.href = "User_main_dish.html";
    }
  } catch (error) {
    alert("Network error. Please try again.");
  }
});
