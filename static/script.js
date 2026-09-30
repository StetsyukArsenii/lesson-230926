const addButton = document.getElementById('add');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close');
const form = document.getElementById('add-ad-form');
const wrapper = document.querySelector('.wrapper');

function renderAd(ad) {
    const card = document.createElement('article');
    card.className = 'ad-card';

    const title = document.createElement('h2');
    title.textContent = ad.title;

    const description = document.createElement('p');
    description.textContent = ad.description;

    card.append(title, description);
    wrapper.append(card);
}

async function loadAds() {
    const response = await fetch('/ads');
    const ads = await response.json();
    ads.forEach(renderAd);
}

if (wrapper) {
    loadAds().catch((error) => console.error('Could not load ads:', error));
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

if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}

if (form && wrapper && modal) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const ad = {
            title: formData.get('title'),
            description: formData.get('description')
        };

        const response = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ad)
        });

        if (!response.ok) {
            throw new Error('Could not save the ad');
        }

        renderAd(await response.json());
        form.reset();
        modal.classList.remove('active');
    });
}
