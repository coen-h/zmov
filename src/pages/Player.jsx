import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Player() {
    const { type, id, season, episode } = useParams();
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const [totalSeasons, setTotalSeasons] = useState(0);
    
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchSeasonData = async () => {
            if (type === 'tv') {
                try {
                    const showResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);
                    const showData = await showResponse.json();
                    setTotalSeasons(showData.number_of_seasons);

                    const seasonResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}`);
                    const seasonData = await seasonResponse.json();
                    setTotalEpisodes(seasonData.episodes.length);
                } catch (error) {
                    console.error('Error fetching season data:', error);
                }
            }
        };

        fetchSeasonData();
    }, [id, season, type]);

    const nextEpisode = parseInt(episode) + 1;
    const nextSeason = parseInt(season) + 1;

    const nextEpisodeLink = nextEpisode > totalEpisodes
        ? nextSeason > totalSeasons
            ? `/info/${type}/${id}`
            : `/player/${type}/${id}/${nextSeason}/1`
        : `/player/${type}/${id}/${season}/${nextEpisode}`;

    return (
        <>
            <div id="iframe-container">
                <iframe 
                    src={`https://vidsrc.pro/embed/${type}/${id}/${season}/${episode}`} 
                    allowFullScreen={true}
                    style={{ width: "100%", height: "100%" }}
                ></iframe>
            </div>
            <div id="button-grid">
                <Link to={nextEpisodeLink} id="next-episode-button">Next</Link>
                <Link to={`/info/${type}/${id}`} id="back-button">Back</Link>
            </div>
        </>
    );
}