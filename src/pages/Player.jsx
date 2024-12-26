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
    const [selectedServer, setSelectedServer] = useState(() => {
        return localStorage.getItem('preferredServer') || 'PRO';
    });

    const playerURLs = import.meta.env
    const apiKey = import.meta.env.VITE_API_KEY;
    const blockedUrls = import.meta.env.VITE_BLOCKED_URLS?.split(',') || [];

    const getCurrentUrlId = () => {
        const pathSegments = window.location.pathname.split('/');
        return pathSegments[pathSegments.length - 1];
    };

    const serverURLs = {
        FLICKY: `${playerURLs.VITE_STREAM_FLICKY}/embed/${type}/?id=${id}`,
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
        ANICDNDUB: `${playerURLs.VITE_STREAM_ANIME1DUB}/v/${animeTitle}-dub`,
        ANICDNSUB: `${playerURLs.VITE_STREAM_ANIME1SUB}/v/${animeTitle}`,
        ANI2DUB: `${playerURLs.VITE_STREAM_ANIME2DUB}/embed/${animeTitle}-dub`,
        ANI2SUB: `${playerURLs.VITE_STREAM_ANIME2SUB}/embed/${animeTitle}`,
        AUTOANIDUB: `${playerURLs.VITE_STREAM_ANIME3DUB}/embed/${animeTitle}-dub`,        
        AUTOANISUB: `${playerURLs.VITE_STREAM_ANIME3SUB}/embed/${animeTitle}`,
        FLICKYANI: `${playerURLs.VITE_STREAM_FLICKYANI}/embed/anime/?id=${id}`
    };

    const handleServerChange = (e) => {
        const newServer = e.target.value;
        setSelectedServer(newServer);
        localStorage.setItem('preferredServer', newServer);
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
        if (selectedServer === 'XYZ' || selectedServer === 'MULTI' || selectedServer === 'INDIAN' || selectedServer === 'MULTLANG' || selectedServer === 'ANIME1DUB' || selectedServer === 'ANIME1SUB' || selectedServer === 'ANIME2DUB' || selectedServer === 'ANIME2SUB' || selectedServer === 'ANIME3DUB' || selectedServer === 'ANIME3SUB' || selectedServer === 'NL') {
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
          {blockedUrls.includes(getCurrentUrlId()) ? (
            <div className="w-screen h-screen flex grayscale justify-center items-center">
              <p className="text-2xl font-bold">This content has been removed</p>
            </div>
          ) : (
          <>
            <div className='flex w-screen h-screen'>
                <iframe 
                    src={getServerURL()} 
                    allowFullScreen={true}
                    className='w-screen h-screen border-0'
                ></iframe>
            </div>
            <div className='flex justify-between w-screen absolute' style={{top: gridPos}}>
                <Link to={`/info/${type}/${id}`}><i className="fa-solid fa-arrow-left text-3xl ml-2 mt-2 hover:opacity-50" alt="Back" /></Link>
                <div className='flex items-center'>
                    <a href={`https://dl.vidsrc.vip/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`} target="_blank" rel="noopener noreferrer">
                        <i className="fa-solid fa-download text-3xl mr-1 hover:opacity-50" alt="Back" />
                    </a>
                    <select 
                        name="servers" 
                        value={selectedServer} 
                        onChange={handleServerChange}
                        className='px-4 py-1 m-1 text-xl bg-black border-2 border-white border-opacity-20 rounded-lg cursor-pointer'
                    >   
                        <option style={{backgroundColor: "rgb(50, 50, 50)"}} selected disabled>ADFREE</option>
                        <option value="VIDLINK">VIDLINK</option>
                        <option value="FLICKY">FLICKY</option>
                        <option value="NL">NL</option>
                        <option style={{backgroundColor: "rgb(50, 50, 50)"}} selected disabled>ADS</option>
                        <option value="VIDBINGE">BINGE (4K)</option>
                        <option value="PRO">PRO</option>
                        <option value="VIP">VIP</option>
                        <option value="CLUB">CLUB</option>
                        <option value="XYZ">XYZ</option>
                        <option value="CC">CC</option>
                        <option value="MULTI">MULTI</option>
                        <option value="SS">SMASHY</option>
                        <option style={{backgroundColor: "rgb(50, 50, 50)"}} selected disabled>LANGUAGE</option>
                        <option value="FRENCH">FRENCH</option>
                        <option value="INDIAN">INDIAN</option>
                        <option value="PORT">PORT</option>
                        <option value="RUSSIAN">RUSSIAN</option>
                        <option value="MULTLANG">MULTLANG</option>
                        <option style={{backgroundColor: "rgb(50, 50, 50)"}} selected disabled>ANIME</option>
                        <option value="ANICDNDUB">ANICDN-DUB</option>
                        <option value="ANICDNSUB">ANICDN-SUB</option>
                        <option value="ANI2DUB">2ANI-DUB</option>
                        <option value="ANI2SUB">2ANI-SUB</option>
                        <option value="AUTOANIDUB">AUTOANI-DUB</option>
                        <option value="AUTOANISUB">AUTOANI-SUB</option>
                        <option value="FLICKYANI">FLICKYANI</option>
                    </select>
                    {type === 'tv' && season && episode && (
                        <Link to={nextEpisodeLink} ><i className="fa-solid fa-arrow-right text-3xl mr-2 ml-1 hover:opacity-50" alt="Next" /></Link>
                    )}
                </div>
            </div>
          </>
          )}
        </>
    );
}