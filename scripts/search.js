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
        resultElement.classList.add('card');
        resultElement.innerHTML = `
            <img class="lazy" src="../media/black.jpg" data-src="${result.poster}" alt="${result.title}">
            <div class="card-play"><img class="play-icon" src="../media/play.png"></div>
            <p class="card-content">${result.title}</p>
        `;

        searchResultsContainer.appendChild(resultElement);

        resultElement.addEventListener('click', () => {
            window.location.href = `/pages/info.html?type=${result.type}&id=${result.id}`;
        });
    });

    initializeLazyLoading()
}

function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');
    
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.onload = () => {
                        lazyImage.classList.remove('lazy');
                        lazyImage.classList.add('loaded');
                    }
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        let lazyLoad = function() {
            lazyImages.forEach(function(lazyImage) {
                if (lazyImage.getBoundingClientRect().top < window.innerHeight && lazyImage.getBoundingClientRect().bottom > 0 && getComputedStyle(lazyImage).display !== "none") {
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.onload = () => {
                        lazyImage.classList.remove('lazy');
                        lazyImage.classList.add('loaded');
                    }
                }
            });

            if (lazyImages.length == 0) {
                document.removeEventListener("scroll", lazyLoad);
                window.removeEventListener("resize", lazyLoad);
                window.removeEventListener("orientationchange", lazyLoad);
            }
        };

        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);
    }
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