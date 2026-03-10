document.addEventListener('DOMContentLoaded', () => {
    const videoUpload = document.getElementById('video-upload');
    const videoGallery = document.querySelector('.video-gallery');

    videoUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const videoElement = document.createElement('video');
                videoElement.src = e.target.result;
                videoElement.controls = true;
                videoElement.width = 250;
                videoGallery.appendChild(videoElement);
            };
            reader.readAsDataURL(file);
        }
    });
});
