document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const id = urlParams.get('id');

    if (type && id) {
        fetchInfo(type, id);
    }

    document.getElementById('play-button').addEventListener('click', function() {
        window.location.href = `player.html?type=${type}&id=${id}`;
    });
});

function fetchInfo(type, id) {
    const url = `https://api.rypr.ru/${type}/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayInfo(data.data);
            } else {
                console.error('Failed to fetch data:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayInfo(info) {
    document.getElementById('info-poster').src = info.images.poster;
    document.getElementById('info-title').textContent = info.title;
    document.getElementById('info-description').textContent = info.description;
    document.getElementById('info-rating').textContent = `${info.rating}`;
    document.getElementById('info-genres').textContent = `${info.genres.map(genre => genre.name).join(', ')}`;
    document.getElementById('info-date').textContent = `${info.date}`;

    const suggestedContainer = document.getElementById('suggested-container');
    info.suggested.forEach(suggestedItem => {
        const suggestedElement = document.createElement('div');
        suggestedElement.classList.add('suggested-card');
        suggestedElement.innerHTML = `
            <img src="${suggestedItem.poster}" alt="${suggestedItem.title}" id="suggested-poster">
            <div class="suggested-content">
                <p id="suggested-card-title">${suggestedItem.title}</p>
            </div>
        `;
        suggestedContainer.appendChild(suggestedElement);

        suggestedElement.addEventListener('click', () => {
            window.location.href = `../pages/info.html?type=${suggestedItem.type}&id=${suggestedItem.id}`;
        });
    });
}

function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
        window.location.href = `./pages/search.html?q=${query}`;
    }
}

document.getElementById('search-icon').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});