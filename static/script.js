const addButton = document.getElementById('add');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close');
const form = document.getElementById('add-ad-form');
const imageInput = document.getElementById('image');
const imagePreview = document.querySelector('.image-preview');
const clearButton = document.querySelector('.clear-button');
const errorMessage = form?.querySelector('.form-error');
let previewUrls = [];

function clearImagePreview() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    previewUrls = [];
    imagePreview.replaceChildren();
    imagePreview.hidden = true;
}

if (form && clearButton) {
    clearButton.addEventListener('click', () => {
        form.reset();
        clearImagePreview();
        errorMessage.hidden = true;
        errorMessage.textContent = '';
    });
}

if (imageInput && imagePreview) {
    imageInput.addEventListener('change', () => {
        clearImagePreview();
        const files = Array.from(imageInput.files || []);
        if (files.length === 0) {
            return;
        }

        files.forEach((file) => {
            if (!file.type.startsWith('image/')) {
                return;
            }

            const url = URL.createObjectURL(file);
            previewUrls.push(url);

            const image = document.createElement('img');
            image.src = url;
            image.alt = file.name;
            imagePreview.append(image);
        });

        imagePreview.hidden = previewUrls.length === 0;
    });
}

if (addButton && modal) {
    addButton.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

if (closeButton && modal) {
    closeButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.remove('active');
    });
}

if (form && modal) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const errorMessage = form.querySelector('.form-error');
        const submitButton = form.querySelector('[type="submit"]');
        errorMessage.hidden = true;
        submitButton.disabled = true;

        try {
            const response = await fetch('/add', {
                method: 'POST',
                body: new FormData(form)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Could not save the product');
            }

            clearImagePreview();
            window.location.reload();
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.hidden = false;
        } finally {
            submitButton.disabled = false;
        }
    });
}
