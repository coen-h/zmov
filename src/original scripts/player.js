const nextEpisodeButton = document.getElementById('next-episode-button');
const backButton = document.getElementById('back-button');
const iframeContainer = document.getElementById('iframe-container');

function showButtons() {
    nextEpisodeButton.style.opacity = '1';
    backButton.style.opacity = '1';
}

function hideButtons() {
    nextEpisodeButton.style.opacity = '0';
    backButton.style.opacity = '0';
}

let hideButtonsTimeout;

function resetHideButtonsTimer() {
    showButtons();
    clearTimeout(hideButtonsTimeout);
    hideButtonsTimeout = setTimeout(hideButtons, 2000);
}

iframeContainer.addEventListener('mousemove', resetHideButtonsTimer);
document.getElementById('button-grid').addEventListener('mousemove', resetHideButtonsTimer);

resetHideButtonsTimer();

document.addEventListener('DOMContentLoaded', function() {
    const iframeContainer = document.getElementById('iframe-container');
    const nextEpisodeButton = document.getElementById('next-episode-button');
    const backButton = document.getElementById('back-button');
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const id = urlParams.get('id');
    let season = parseInt(urlParams.get('season')) || 1;
    let episode = parseInt(urlParams.get('episode')) || 1;

    async function getNumberOfEpisodes(id, season) {
        try {
            const response = await fetch(`https://api.rypr.ru/episodes/${id}?s=${season}`);
            const data = await response.json();
            return data.data.length;
        } catch (error) {
            console.error('Error fetching episode data:', error);
            return 0;
        }
    }

    async function getNumberOfSeasons(id) {
        try {
            const response = await fetch(`https://api.rypr.ru/series/${id}`);
            const data = await response.json();
            return data.data.seasons;
        } catch (error) {
            console.error('Error fetching series data:', error);
            return 0;
        }
    }

    async function updateIframe() {
        let iframeSrc;

        if (type === 'movie') {
            iframeSrc = `https://vidsrc.pro/embed/movie/${id}`;
            nextEpisodeButton.style.display = 'none';
            backButton.style.margin = '0';
        } else if (type === 'series') {
            iframeSrc = `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
            nextEpisodeButton.style.display = 'flex';
        }

        iframeContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = iframeSrc;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;

        iframeContainer.appendChild(iframe);
    }

    nextEpisodeButton.addEventListener('click', async () => {
        const totalEpisodes = await getNumberOfEpisodes(id, season);
        const totalSeasons = await getNumberOfSeasons(id);

        if (episode < totalEpisodes) {
            episode++;
        } else if (season < totalSeasons) {
            season++;
            episode = 1;
        } else {
            window.location.href = `../pages/info.html?type=${type}&id=${id}`;
            return;
        }

        updateIframe();

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('season', season);
        newUrl.searchParams.set('episode', episode);
        window.history.pushState({}, '', newUrl);
    });

    backButton.addEventListener('click', () => {
        window.location.href = `../pages/info.html?type=${type}&id=${id}`;
    });

    if (type && id) {
        updateIframe();
    } else {
        iframeContainer.innerHTML = '<p>Error: Missing type or id in the URL parameters.</p>';
        nextEpisodeButton.style.display = 'none';
    }
});
