async function fetchMoviesAndSeries() {
    try {
        const response = await fetch('https://api.rypr.ru/browse');
        const data = await response.json();
        
        const heroItem = data.data.hero;

        const trendingMovies = data.data.collections.find(collection => collection.title === 'Trending movies this week').items.map(item => ({
            conType: 'trendmovie',
            title: item.title,
            poster: item.poster,
            type: "movie",
            id: item.id,
        }));
        const trendingSeries = data.data.collections.find(collection => collection.title === 'Trending series this week').items.map(item => ({
            conType: 'trendseries',
            title: item.title,
            poster: item.poster,
            type: "series",
            id: item.id,
        }));
        const popularMovies = data.data.collections.find(collection => collection.title === 'Popular movies').items.map(item => ({
            conType: 'popmovie',
            title: item.title,
            poster: item.poster,
            type: "movie",
            id: item.id,
        }));
        const popularSeries = data.data.collections.find(collection => collection.title === 'Popular series').items.map(item => ({
            conType: 'popseries',
            title: item.title,
            poster: item.poster,
            type: "series",
            id: item.id,
        }));
        const topMovies = data.data.collections.find(collection => collection.title === 'Top rated movies').items.map(item => ({
            conType: 'topmovie',
            title: item.title,
            poster: item.poster,
            type: "movie",
            id: item.id,
        }));
        const topSeries = data.data.collections.find(collection => collection.title === 'Top rated series').items.map(item => ({
            conType: 'topseries',
            title: item.title,
            poster: item.poster,
            type: "series",
            id: item.id,
        }));
        const upMovies = data.data.collections.find(collection => collection.title === 'Upcoming movies').items.map(item => ({
            conType: 'upmovie',
            title: item.title,
            poster: item.poster,
            type: "movie",
            id: item.id,
        }));
        const onSeries = data.data.collections.find(collection => collection.title === 'On the air series').items.map(item => ({
            conType: 'onseries',
            title: item.title,
            poster: item.poster,
            type: "series",
            id: item.id,
        }));

        return { items: [...trendingMovies, ...trendingSeries, ...popularMovies, ...popularSeries, ...topMovies, ...topSeries, ...upMovies, ...onSeries], heroItem };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { items: [], heroItem: null };
    }
}

function displayMoviesAndSeries({ items, heroItem }) {
    const trendMoviesContainer = document.getElementById('discover-card1');
    const trendSeriesContainer = document.getElementById('discover-card2');
    const popMoviesContainer = document.getElementById('discover-card3');
    const popSeriesContainer = document.getElementById('discover-card4');
    const topMoviesContainer = document.getElementById('discover-card5');
    const topSeriesContainer = document.getElementById('discover-card6');
    const upMoviesContainer = document.getElementById('discover-card7');
    const onSeriesContainer = document.getElementById('discover-card8');
    const heroContainer = document.getElementById('hero');
    
    trendMoviesContainer.innerHTML = '';
    trendSeriesContainer.innerHTML = '';
    popMoviesContainer.innerHTML = '';
    popSeriesContainer.innerHTML = '';
    topMoviesContainer.innerHTML = '';
    topSeriesContainer.innerHTML = '';
    upMoviesContainer.innerHTML = '';
    onSeriesContainer.innerHTML = '';
    heroContainer.innerHTML = '';

    if (heroItem) {
        heroContainer.innerHTML = `
            <img id="hero-image" src="${heroItem.images.backdrop}" alt="${heroItem.title}">
            <div class="hero-card">
                <div id="hero-content">
                    <div id="hero-title"><img src="${heroItem.images.logo}"></div>
                    <div id="hero-desc"><p>${heroItem.description}</p></div>
                    <div id="hero-buttons">
                        <div id="hero-watch"><button id="hero-button">Watch</button></div>
                        <div id="hero-more"><button id="hero-button">Info</button></div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('hero-watch').addEventListener('click', () => {
            window.location.href = `./pages/player.html?type=${heroItem.type}&id=${heroItem.id}`;
        });
        document.getElementById('hero-more').addEventListener('click', () => {
            window.location.href = `./pages/info.html?type=${heroItem.type}&id=${heroItem.id}`;
        });
    }

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('card');
        itemElement.innerHTML = `
            <img class="lazy" src="../media/black.jpg" data-src="${item.poster}" alt="${item.title}">
            <div class="card-play"><img class="play-icon" src="../media/play.png"></div>
            <p class="card-content">${item.title}</p>
        `;
        
        if (item.conType === 'trendmovie') {
            trendMoviesContainer.appendChild(itemElement);
        } else if (item.conType === 'trendseries') {
            trendSeriesContainer.appendChild(itemElement);
        } else if (item.conType === 'popmovie') {
            popMoviesContainer.appendChild(itemElement);
        } else if (item.conType === 'popseries') {
            popSeriesContainer.appendChild(itemElement);
        } else if (item.conType === 'topmovie') {
            topMoviesContainer.appendChild(itemElement);
        } else if (item.conType === 'topseries') {
            topSeriesContainer.appendChild(itemElement);
        } else if (item.conType === 'upmovie') {
            upMoviesContainer.appendChild(itemElement);
        } else if (item.conType === 'onseries') {
            onSeriesContainer.appendChild(itemElement);
        }

        itemElement.addEventListener('click', () => {
            window.location.href = `./pages/info.html?type=${item.type}&id=${item.id}`;
        });
    });

    initializeLazyLoading();

    const image = document.getElementById('hero-image');
    function fadeInImage() {
    image.classList.add('hero-animation');
    }
    image.onload = fadeInImage;
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

document.addEventListener('DOMContentLoaded', function() {
    const carouselButtons = document.querySelectorAll('.carousel-btn');

    carouselButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const targetId = button.getAttribute('data-target');
            const carousel = document.querySelector(targetId);
            const cards = carousel.querySelectorAll('.card');
            const cardWidth = cards[0].offsetWidth;

            if (button.classList.contains('prev-btn')) {
                const newPosition = carousel.scrollLeft - (3 * cardWidth);
                carousel.scrollTo({
                    left: newPosition,
                    behavior: 'smooth'
                });
            } else if (button.classList.contains('next-btn')) {
                const newPosition = carousel.scrollLeft + (3 * cardWidth);
                carousel.scrollTo({
                    left: newPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});


fetchMoviesAndSeries().then(displayMoviesAndSeries);