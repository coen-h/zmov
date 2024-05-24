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
                displayInfo(data.data, type);
            } else {
                console.error('Failed to fetch data:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayInfo(info, type) {
    document.getElementById('info-poster').src = info.images.poster;
    document.getElementById('info-backdrop').src = info.images.backdrop;
    document.getElementById('info-title').textContent = info.title;
    document.getElementById('info-description').textContent = info.description;
    document.getElementById('info-rating').textContent = `${info.rating.toString().slice(0, 1)}.${info.rating.toString().slice(1)}`;
    document.getElementById('info-date').textContent = `${info.date}`;

    const genresContainer = document.getElementById('info-genres');
    genresContainer.innerHTML = '';

    info.genres.forEach(genre => {
        const genreBox = document.createElement('div');
        genreBox.classList.add('genre-box');
        genreBox.textContent = genre.name;
        genresContainer.appendChild(genreBox);
    });

    const suggestedContainer = document.getElementById('suggested-container');
    suggestedContainer.innerHTML = '';

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

    const seasonContainer = document.getElementById('season-container');
    const seasonSelector = document.getElementById('season-selector');
    const episodesContainer = document.getElementById('episodes-container');

    if (type === 'series') {
        seasonContainer.classList.remove('hidden');
        seasonSelector.classList.remove('hidden');
        episodesContainer.classList.remove('hidden');
        fetchEpisodes(info.id, 1);
        setupSeasonSelector(info.id, info.seasons);
    } else {
        seasonContainer.classList.add('hidden');
        seasonSelector.classList.add('hidden');
        episodesContainer.classList.add('hidden');
    }
}

function fetchEpisodes(showId, seasonNumber) {
    const url = `https://api.rypr.ru/episodes/${showId}?s=${seasonNumber}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayEpisodes(data.data, showId, seasonNumber);
            } else {
                console.error('Failed to fetch episodes:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching episodes:', error);
        });
}

function displayEpisodes(episodes, showId, seasonNumber) {
    const episodesContainer = document.getElementById('episodes-container');
    episodesContainer.innerHTML = '';

    episodes.forEach(episode => {
        const episodeElement = document.createElement('div');
        episodeElement.classList.add('episode-box');
        episodeElement.innerHTML = `
            <img id="episode-image" src="${episode.image}" alt="${episode.title}">
            <div class="episode-content">
                <p id="episode-title">${episode.title}</p>
                <p id="episode-desc">${episode.description}</p>
            </div>
        `;
        episodesContainer.appendChild(episodeElement);

        episodeElement.addEventListener('click', () => {
            window.location.href = `../pages/player.html?type=series&id=${showId}&season=${seasonNumber}&episode=${episode.number}`;
        });
    });
}

function setupSeasonSelector(showId, totalSeasons) {
    const seasonSelector = document.getElementById('season-selector');
    seasonSelector.innerHTML = '';

    for (let i = 1; i <= totalSeasons; i++) {
        const seasonOption = document.createElement('option');
        seasonOption.value = i;
        seasonOption.textContent = `Season ${i}`;
        seasonSelector.appendChild(seasonOption);
    }

    seasonSelector.addEventListener('change', function() {
        const selectedSeason = this.value;
        fetchEpisodes(showId, selectedSeason);
    });
}

function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
        window.location.href = `/pages/search.html?q=${query}`;
    }
}

document.getElementById('search-icon').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
