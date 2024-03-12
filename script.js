async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during login');
    }
}

async function uploadImage() {
    const imageInput = document.getElementById('image');
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            const uploadedImage = document.getElementById('uploadedImage');
            uploadedImage.src = data.imagePath;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during image upload');
    }
}