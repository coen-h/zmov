import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { useParams, Link } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

export default function InfoContent() {
    const { type, id } = useParams();
    const [data, setData] = useState({
        item: {},
        logoImage: '',
        genres: [],
        recommendations: [],
        isSeries: false,
        seasons: [],
        selectedSeason: '',
        episodes: [],
        isLoading: true,
    });
    const loadingBarRef = useRef(null);

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        setData(prevData => ({ ...prevData, isLoading: true }));
    }, [type, id]);

    useEffect(() => {
        const fetchData = async () => {
            if (loadingBarRef.current) loadingBarRef.current.continuousStart();
            try {
                const append_to_response = type === 'tv' ? 'content_ratings,images,recommendations' : 'release_dates,images,recommendations';
                const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=${append_to_response}`);
                const result = await response.json();
                const logo = result.images.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
                const isSeries = type === 'tv';
                const seasons = isSeries ? result.seasons : [];
                const selectedSeason = isSeries && seasons.length > 0 ? seasons[0].season_number : '';

                setData({
                    item: result,
                    logoImage: logo,
                    genres: result.genres,
                    recommendations: result.recommendations.results,
                    isSeries,
                    seasons,
                    selectedSeason,
                    episodes: [],
                    isLoading: false,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                if (loadingBarRef.current) loadingBarRef.current.complete();
            }
        };

        fetchData();
    }, [type, id]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (type === 'tv' && data.selectedSeason !== '') {
                if (loadingBarRef.current) loadingBarRef.current.continuousStart();
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${data.selectedSeason}?api_key=${apiKey}`);
                    const result = await response.json();
                    setData(prevData => ({ ...prevData, episodes: result.episodes }));
                } catch (error) {
                    console.error('Error fetching episodes:', error);
                } finally {
                    if (loadingBarRef.current) loadingBarRef.current.complete();
                }
            }
        };

        fetchEpisodes();
    }, [type, id, data.selectedSeason]);

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getContentRating = () => {
        if (type === 'tv') {
            return data.item.content_ratings?.results.find(r => r.iso_3166_1 === 'US')?.rating || 'NR';
        } else {
            return data.item.release_dates?.results.find(r => r.iso_3166_1 === 'US')?.release_dates[0]?.certification || 'NR';
        }
    };

    const handleSeasonChange = (e) => {
        setData(prevData => ({ ...prevData, selectedSeason: e.target.value }));
    };

    return (
        <>
            <LoadingBar color="#FF0000" ref={loadingBarRef} />
            <div id="info-container">
                {data.isLoading && (
                    <div className="loader"></div>
                )}
                {!data.isLoading && (
                    <>
                        <img id="info-backdrop" src={data.item.backdrop_path && `https://image.tmdb.org/t/p/original${data.item.backdrop_path}`} alt="Backdrop" />
                        <img id="info-poster" src={data.item.poster_path && `https://image.tmdb.org/t/p/w500/${data.item.poster_path}`} alt="Poster" />
                        <div id="info-top">
                            <img id="info-title" src={data.logoImage && `https://image.tmdb.org/t/p/original${data.logoImage}`} alt="Title" />
                            <div id="info-title-fallback" className="hidden">{data.item.title || data.item.name}</div>
                            <div id="info-bar">
                                <p id="info-date">{type === 'tv' ? data.item.first_air_date : data.item.release_date}</p>
                                <img src="/star.svg" id="info-star" alt="Star Icon" />
                                <p id="info-rating">{parseFloat(data.item.vote_average).toFixed(1)}</p>
                                <p id="info-content-rating">{getContentRating()}</p>
                                <p id="info-runtime">{data.item.runtime ? formatRuntime(data.item.runtime) : null}</p>
                            </div>
                            <div id="info-genres">
                                {data.genres.map(genre => (
                                    <div className="genre-box" key={genre.id}>{genre.name}</div>
                                ))}
                            </div>
                            <p id="info-description">{data.item.overview}</p>
                            <Link to={`/player/${type}/${id}/1/1`}><button id="play-button">Play</button></Link>
                        </div>
                    </>
                )}
            </div>
            <div id="info-bottom">
                {data.isSeries && (
                    <>
                        <div id="season-container">
                            <select id="season-selector" value={data.selectedSeason} onChange={handleSeasonChange}>
                                {data.seasons.map(season => (
                                    <option key={season.id} value={season.season_number}>{season.name}</option>
                                ))}
                            </select>
                        </div>
                        <div id="episodes-container">
                            {data.episodes.map(episode => (
                                <Link to={`/player/${type}/${id}/${data.selectedSeason}/${episode.episode_number}`} key={episode.id}>
                                    <div className="episode-box">
                                        <img id="episode-image" src={`https://image.tmdb.org/t/p/w500${episode.still_path}`} alt={`Episode ${episode.episode_number}`} />
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
                    {data.recommendations.map(recommendation => (
                        <Card size="big-image" key={recommendation.id} item={recommendation} type={type} />
                    ))}
                </div>
            </div>
        </>
    );
}
