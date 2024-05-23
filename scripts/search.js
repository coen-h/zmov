async function fetchSearchResults(query) {
    try {
        const response = await fetch(`https://api.rypr.ru/search?q=${query}`);
        const data = await response.json();
        return data.data.map(item => ({
            title: item.title,
            poster: item.poster,
            type: item.type,
            id: item.id
        }));
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<div id="search-none"><p>No results found for your search.</p></div>';
        return;
    }

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('search-card');
        resultElement.innerHTML = `
            <img src="${result.poster}" alt="${result.title}">
            <div class="search-card-content">
                <h2>${result.title}</h2>
                <p id="search-type">${result.type}</p>
            </div>
        `;

        searchResultsContainer.appendChild(resultElement);

        resultElement.addEventListener('click', () => {
            window.location.href = `../pages/player.html?type=${result.type}&id=${result.id}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        fetchSearchResults(query).then(displaySearchResults);
    }
});

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