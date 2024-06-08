import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useParams, Link } from 'react-router-dom';

export default function InfoContent() {
    const { type, id } = useParams();
    const [item, setItem] = useState({});
    const [logoImage, setLogoImage] = useState('');
    const [genres, setGenres] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isSeries, setIsSeries] = useState(false);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [episodes, setEpisodes] = useState([]);

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`);
                const data = await response.json();
                setItem(data);
                setGenres(data.genres);
                setIsSeries(type === 'tv');
                
                const imagesResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}`);
                const imagesData = await imagesResponse.json();
                const logo = imagesData.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
                setLogoImage(logo);

                const recResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${apiKey}`);
                const recData = await recResponse.json();
                setRecommendations(recData.results);

                if (type === 'tv') {
                    setSeasons(data.seasons);
                    setSelectedSeason(data.seasons[0]?.season_number || '');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [type, id]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (type === 'tv' && selectedSeason !== '') {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${apiKey}`);
                    const data = await response.json();
                    setEpisodes(data.episodes);
                } catch (error) {
                    console.error('Error fetching episodes:', error);
                }
            }
        };

        fetchEpisodes();
    }, [type, id, selectedSeason]);

    return (
    <>
        <div id="info-container">
            <img id="info-backdrop" src={item.backdrop_path && `https://image.tmdb.org/t/p/original${item.backdrop_path}`} />
            <img id="info-poster" src={item.poster_path && `https://image.tmdb.org/t/p/w500/${item.poster_path}`} />
            <div id="info-top">
                <img id="info-title" src={logoImage && `https://image.tmdb.org/t/p/original${logoImage}`} />
                <div id="info-title-fallback" className="hidden">{item.title}</div>
                <div id="info-bar">
                    <img src="/src/assets/star.svg" id="info-star" />
                    <p id="info-rating">{parseFloat(item.vote_average).toFixed(1)}</p>
                    <p id="info-date">{type === 'tv' ? item.first_air_date : item.release_date}</p>
                </div>
                <div id="info-genres">
                    {genres.map(genre => (
                        <div className="genre-box" key={genre.id}>{genre.name}</div>
                    ))}
                </div>
                <p id="info-description">{item.overview}</p>
                <Link to={`/player/${type}/${id}/1/1`}><button id="play-button">Play</button></Link>
            </div>
        </div>
        <div id="info-bottom">
            {isSeries && (
                <>
                    <div id="season-container">
                        <select id="season-selector" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                            {seasons.map(season => (
                                <option key={season.id} value={season.season_number}>{season.name}</option>
                            ))}
                        </select>
                    </div>
                    <div id="episodes-container">
                        {episodes.map(episode => (
                            <Link to={`/player/${type}/${id}/${selectedSeason}/${episode.episode_number}`} key={episode.id}>
                                <div className="episode-box">
                                    <img id="episode-image" src={`https://image.tmdb.org/t/p/original${episode.still_path}`} alt={`Episode ${episode.episode_number}`} />
                                    <div className="episode-content">
                                        <p id="episode-title">{episode.name}</p>
                                        <p id="episode-desc">{episode.overview}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
            <p id="suggested-title">You may also like</p>
            <div id="suggested-container">
                {recommendations.map(recommendation => (
                    <Card size="big-image" key={recommendation.id} item={recommendation} type={type} />
                ))}
            </div>
        </div>
    </>
    );
}