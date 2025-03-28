document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('edit-profile-form');
    const fileInput = document.getElementById('profile-picture');
    const usernameInput = document.getElementById('username');

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const maxWidth = 300;
                    const maxHeight = 300;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    const resizedImage = canvas.toDataURL('image/jpeg', 0.8);

                    localStorage.setItem('profileImage', resizedImage);
                    localStorage.setItem('username', usernameInput.value);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        localStorage.setItem('username', usernameInput.value);
        alert('Profile updated successfully!');
        window.location.href = 'profile.html';
    });
});