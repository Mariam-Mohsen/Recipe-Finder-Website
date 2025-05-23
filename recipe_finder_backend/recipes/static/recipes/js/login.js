
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("❌ Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    alert(result.message || "Login successful");

    if (response.ok) {
      window.location.href = result.is_staff ? "/admin.html" : "/index.html";
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("❌ Login failed. Please try again.");
  }
});
