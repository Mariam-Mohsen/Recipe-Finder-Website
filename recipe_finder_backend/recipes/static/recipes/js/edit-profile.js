function previewImage(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        // Check if the preview is an image or a div
        if (preview.tagName.toLowerCase() === 'img') {
            preview.src = reader.result;
        } else {
            // If it's a div, replace it with an image
            const previewContainer = preview.parentNode;
            const newImg = document.createElement('img');
            newImg.id = 'preview';
            newImg.className = 'profile-photo-preview';
            newImg.alt = 'Profile Photo Preview';
            newImg.src = reader.result;
            previewContainer.replaceChild(newImg, preview);
        }
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        // If no file selected, don't change anything
        return;
    }
}