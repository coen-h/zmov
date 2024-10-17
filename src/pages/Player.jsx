import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

export default function Player() {
    const { type, id } = useParams();
    const [imdbId, setImdbId] = useState('');
    const [animeTitle, setAnimeTitle] = useState('');
    const location = useLocation();
    const [gridPos, setGridPos] = useState(0);
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const [totalSeasons, setTotalSeasons] = useState(0);
    const [season, setSeason] = useState(null);
    const [episode, setEpisode] = useState(null);
    const [selectedServer, setSelectedServer] = useState('VIDLINK');

    const playerURLs = import.meta.env
    const apiKey = import.meta.env.VITE_API_KEY;

    const serverURLs = {
        PRO: `${playerURLs.VITE_STREAM_PRO}/embed/${type}/${id}`,
        VIDBINGE: `${playerURLs.VITE_STREAM_VIDBINGE}/embed/${type}/${id}`,
        VIDLINK: `${playerURLs.VITE_STREAM_VIDLINK}/${type}/${id}`,
        RIP: `${playerURLs.VITE_STREAM_RIP}/embed/${type}/${id}`,
        NL: `${playerURLs.VITE_STREAM_NL}/embed/${type}/${id}`,
        CC: `${playerURLs.VITE_STREAM_CC}/v3/embed/${type}/${id}`,
        VIP: `${playerURLs.VITE_STREAM_VIP}/directstream.php?video_id=${id}&tmdb=1`,
        MULTI: `${playerURLs.VITE_STREAM_MULTI}/?video_id=${id}&tmdb=1`,
        CLUB: `${playerURLs.VITE_STREAM_CLUB}/${type}/${id}`,
        XYZ: `${playerURLs.VITE_STREAM_XYZ}/embed/${type}/${id}`,
        SS: `${playerURLs.VITE_STREAM_SS}/embed/${type}/${id}`,
        FRENCH: `${playerURLs.VITE_STREAM_FRENCH}/api/${type === 'tv' ? 'serie' : 'film'}.php?id=${id}`,
        INDIAN: `${playerURLs.VITE_STREAM_INDIAN}/player/${type === 'tv' ? 'series' : 'movies'}/api3/index.html?id=${id}`,
        PORT: `${playerURLs.VITE_STREAM_PORT}/${type === 'tv' ? 'serie' : 'filme'}/${id}`,
        RUSSIAN: `${playerURLs.VITE_STREAM_RUSSIAN}/embed/imdb/${imdbId}`,
        MULTLANG: `${playerURLs.VITE_STREAM_MULTLANG}/embed/${type}/${id}`,
        ANIME1DUB: `${playerURLs.VITE_STREAM_ANIME1DUB}/v/${animeTitle}-dub`,
        ANIME1SUB: `${playerURLs.VITE_STREAM_ANIME1SUB}/v/${animeTitle}`,
        ANIME2DUB: `${playerURLs.VITE_STREAM_ANIME2DUB}/embed/${animeTitle}-dub`,
        ANIME2SUB: `${playerURLs.VITE_STREAM_ANIME2SUB}/embed/${animeTitle}`,
        ANIME3DUB: `${playerURLs.VITE_STREAM_ANIME3DUB}/embed/${animeTitle}-dub`,        
        ANIME3SUB: `${playerURLs.VITE_STREAM_ANIME3SUB}/embed/${animeTitle}`,

    };

    const getServerURL = () => {
        let url = serverURLs[selectedServer];
        if (type === 'tv' && season && episode) {
            if (selectedServer === 'VIP' || selectedServer === 'MULTI' || selectedServer === 'INDIAN' || selectedServer === 'FLIX') {
                url += `&s=${season}&e=${episode}`;
            } else if (selectedServer === 'SS') {
                url += `?s=${season}&e=${episode}`;
            } else if (selectedServer === 'CLUB') {
                url += `-${season}-${episode}`;
            } else if (selectedServer === 'ROLLER' || selectedServer === 'ONSTREAM') {
                url += `-${season}-${episode}`;
            } else if (selectedServer === 'SFLIX') {
                url += `&season=${season}&episode=${episode}`;
            } else if (selectedServer === 'FRENCH') {
                url += `&sa=${season}&epi=${episode}`;
            } else if (selectedServer === 'ANIME1DUB' || selectedServer === 'ANIME1SUB') {
                url += `/${episode}`;
            } else if (selectedServer === 'ANIME2DUB' || selectedServer === 'ANIME2SUB' || selectedServer === 'ANIME3DUB' || selectedServer === 'ANIME3SUB') {
                url += `-episode-${episode}`;
            } else if (selectedServer === 'RUSSIAN') {
                url += `?season=${season}&episode=${episode}`;
            } else {
                url += `/${season}/${episode}`;
            }
        }
        if (selectedServer === 'VIDLINK') {
            url += '?primaryColor=B20710&secondaryColor=170000&autoplay=true&nextbutton=true';   
        } else if (selectedServer === 'ANIME1DUB' || selectedServer === 'ANIME1SUB') {
            url += '.html';
        }
        return url;
    };
    
    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const seasonParam = pathSegments[4];
        const episodeParam = pathSegments[5];

        setSeason(seasonParam ? parseInt(seasonParam, 10) : null);
        setEpisode(episodeParam ? parseInt(episodeParam, 10) : null);

        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=alternative_titles&external_source=imdb_id`);
                const data = await response.json();
                setImdbId(data.imdb_id);
                setAnimeTitle(data.alternative_titles.results.find((item) => item.type === "Romaji")?.title.replace(/\s+/g, '-'));                  

                document.title = `${data.title || data.name} ${type === "movie" ? '' : `S${seasonParam}E${episodeParam}`} - zmov`;

                if (type === 'tv') {
                    setTotalSeasons(data.number_of_seasons);

                    if (seasonParam && episodeParam) {
                        const seasonResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/season/${seasonParam}?api_key=${apiKey}`);
                        const seasonData = await seasonResponse.json();
                        setTotalEpisodes(seasonData.episodes.length);

                        const continueWatchingItem = {
                            id: id,
                            item: data,
                            season: parseInt(seasonParam, 10),
                            episode: parseInt(episodeParam, 10),
                            type: type
                        };
                        updateContinueWatching(continueWatchingItem);
                    }
                } else {
                    const continueWatchingItem = {
                        id: id,
                        item: data,
                        type: type
                    };
                    updateContinueWatching(continueWatchingItem);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, type, location.pathname, apiKey]);

    useEffect(() => {
        if (selectedServer === 'CC' || selectedServer === 'XYZ' || selectedServer === 'MULTI' || selectedServer === 'INDIAN' || selectedServer === 'MULTLANG' || selectedServer === 'ANIME1DUB' || selectedServer === 'ANIME1SUB' || selectedServer === 'ANIME2DUB' || selectedServer === 'ANIME2SUB' || selectedServer === 'ANIME3DUB' || selectedServer === 'ANIME3SUB' || selectedServer === 'NL') {
            setGridPos(35);
        } else {
            setGridPos(0);
        }
    }, [selectedServer]);

    const updateContinueWatching = (item) => {
        let continueWatching = [];
        try {
            continueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
        } catch (e) {
            console.error('Error parsing continueWatching from localStorage:', e);
            continueWatching = [];
        }

        if (!Array.isArray(continueWatching)) {
            continueWatching = [];
        }

        continueWatching = continueWatching.filter(watch => watch.id !== item.id);
        continueWatching.unshift(item);

        if (continueWatching.length > 10) {
            continueWatching = continueWatching.slice(0, 10);
        }

        localStorage.setItem('continueWatching', JSON.stringify(continueWatching));
    };

    const nextEpisode = episode ? episode + 1 : null;
    const nextSeason = season ? season + 1 : null;

    const nextEpisodeLink = episode && season
        ? nextEpisode > totalEpisodes
            ? nextSeason > totalSeasons
                ? `/info/${type}/${id}`
                : `/watch/${type}/${id}/${nextSeason}/1`
            : `/watch/${type}/${id}/${season}/${nextEpisode}`
        : `/info/${type}/${id}`;

    return (
        <>
            <div style={{display: "flex", width: "100vw", height: "100vh"}}>
                <iframe 
                    src={getServerURL()} 
                    allowFullScreen={true}
                    style={{ width: "100%", height: "100%", border: '0' }}
                ></iframe>
            </div>
            <div id="button-grid" style={{top: gridPos}}>
                <Link to={`/info/${type}/${id}`} id="player-button"><i className="fa-solid fa-arrow-left" alt="Back" style={{fontSize: "26px"}} /></Link>
                <div style={{display: "flex", alignItems: "center"}}>
                    <select 
                        name="servers" 
                        value={selectedServer} 
                        onChange={(e) => setSelectedServer(e.target.value)} 
                        id="server-select"
                    >   
                        <option style={{backgroundColor: "rgba(50,50,50,1)"}} selected disabled>ADFREE</option>
                        <hr/>
                        <option value="VIDLINK">VIDLINK</option>
                        <option value="CC">CC (4K)</option>
                        <option value="NL">NL</option>
                        <option value="RIP">RIP</option>
                        <hr/>
                        <option style={{backgroundColor: "rgba(50,50,50,1)"}} selected disabled>ADS</option>
                        <hr/>
                        <option value="VIDBINGE">BINGE</option>
                        <option value="PRO">PRO</option>
                        <option value="VIP">VIP</option>
                        <option value="CLUB">CLUB</option>
                        <option value="XYZ">XYZ</option>
                        <option value="MULTI">MULTI</option>
                        <option value="SS">SMASHY</option>
                        <hr/>
                        <option style={{backgroundColor: "rgba(50,50,50,1)"}} selected disabled>LANGUAGE</option>
                        <hr/>
                        <option value="FRENCH">FRENCH</option>
                        <option value="INDIAN">INDIAN</option>
                        <option value="PORT">PORT</option>
                        <option value="RUSSIAN">RUSSIAN</option>
                        <option value="MULTLANG">MULTLANG</option>
                        <hr/>
                        <option style={{backgroundColor: "rgba(50,50,50,1)"}} selected disabled>ANIME</option>
                        <hr/>
                        <option value="ANIME1DUB">ANI1-DUB</option>
                        <option value="ANIME1SUB">ANI1-SUB</option>
                        <option value="ANIME2DUB">ANI2-DUB</option>
                        <option value="ANIME2SUB">ANI2-SUB</option>
                        <option value="ANIME3DUB">ANI3-DUB</option>
                        <option value="ANIME3SUB">ANI3-SUB</option>
                    </select>
                    {type === 'tv' && season && episode && (
                        <Link to={nextEpisodeLink} id="player-button"><i className="fa-solid fa-arrow-right" style={{fontSize: "26px"}} alt="Next" /></Link>
                    )}
                </div>
            </div>
        </>
    );
}