async function fetchMoviesAndSeries() {
    try {
        const response = await fetch('https://api.rypr.ru/browse');
        const data = await response.json();
        
        const heroItem = data.data.hero;

        const trendingMovies = data.data.collections.find(collection => collection.title === 'Trending movies this week').items.map(item => ({
            type: 'trendmovie',
            title: item.title,
            poster: item.poster
        }));
        const trendingSeries = data.data.collections.find(collection => collection.title === 'Trending series this week').items.map(item => ({
            type: 'trendseries',
            title: item.title,
            poster: item.poster
        }));
        const popularMovies = data.data.collections.find(collection => collection.title === 'Popular movies').items.map(item => ({
            type: 'popmovie',
            title: item.title,
            poster: item.poster
        }));
        const popularSeries = data.data.collections.find(collection => collection.title === 'Popular series').items.map(item => ({
            type: 'popseries',
            title: item.title,
            poster: item.poster
        }));
        const topMovies = data.data.collections.find(collection => collection.title === 'Top rated movies').items.map(item => ({
            type: 'topmovie',
            title: item.title,
            poster: item.poster
        }));
        const topSeries = data.data.collections.find(collection => collection.title === 'Top rated series').items.map(item => ({
            type: 'topseries',
            title: item.title,
            poster: item.poster
        }));
        const upMovies = data.data.collections.find(collection => collection.title === 'Upcoming movies').items.map(item => ({
            type: 'upmovie',
            title: item.title,
            poster: item.poster
        }));
        const onSeries = data.data.collections.find(collection => collection.title === 'On the air series').items.map(item => ({
            type: 'onseries',
            title: item.title,
            poster: item.poster
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
            <div class="hero-card">
                <img id="hero-image" src="${heroItem.images.backdrop}" alt="${heroItem.title}">
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
    }

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('card');
        itemElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster}" alt="${item.title}">
            <div class="card-content">
                <h2>${item.title}</h2>
            </div>
        `;
        
        if (item.type === 'trendmovie') {
            trendMoviesContainer.appendChild(itemElement);
        } else if (item.type === 'trendseries') {
            trendSeriesContainer.appendChild(itemElement);
        } else if (item.type === 'popmovie') {
            popMoviesContainer.appendChild(itemElement);
        } else if (item.type === 'popseries') {
            popSeriesContainer.appendChild(itemElement);
        } else if (item.type === 'topmovie') {
            topMoviesContainer.appendChild(itemElement);
        } else if (item.type === 'topseries') {
            topSeriesContainer.appendChild(itemElement);
        } else if (item.type === 'upmovie') {
            upMoviesContainer.appendChild(itemElement);
        } else if (item.type === 'onseries') {
            onSeriesContainer.appendChild(itemElement);
        }
    });
}

fetchMoviesAndSeries().then(displayMoviesAndSeries);