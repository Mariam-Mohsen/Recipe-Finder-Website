document.getElementById('is-admin').addEventListener('change', function() {
    const adminIdContainer = document.getElementById('admin-id-container');
    adminIdContainer.style.display = this.checked ? 'block' : 'none';
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const isAdmin = document.getElementById('is-admin').checked;
    const adminId = document.getElementById('admin-id').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const userData = {
        username,
        email,
        password,
        role: isAdmin ? 'admin' : 'user',
        adminId: isAdmin ? adminId : null
    };

    console.log('User Signed Up:', userData);
    alert('Signup successful! Redirecting to login page.');
    window.location.href = 'login.html';
});