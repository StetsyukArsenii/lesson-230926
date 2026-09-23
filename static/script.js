const addButton = document.getElementById('add');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close');

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

if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}
