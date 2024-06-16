import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

export default function Player() {
    const { type, id } = useParams();
    const location = useLocation();
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const [totalSeasons, setTotalSeasons] = useState(0);
    const [season, setSeason] = useState(null);
    const [episode, setEpisode] = useState(null);
    const [buttonGridOpacity, setButtonGridOpacity] = useState(1);
    const [timeoutId, setTimeoutId] = useState(null);
    const [isMobile, setIsMobile] = useState(
        window.innerWidth < 550 || window.innerHeight < 550
    );

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 550 || window.innerHeight < 550);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    useEffect(() => {
        if (type === 'tv') {
            const pathSegments = location.pathname.split('/');
            const seasonParam = pathSegments[4];
            const episodeParam = pathSegments[5];

            setSeason(seasonParam ? parseInt(seasonParam, 10) : null);
            setEpisode(episodeParam ? parseInt(episodeParam, 10) : null);

            const fetchSeasonData = async () => {
                try {
                    const showResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);
                    const showData = await showResponse.json();
                    setTotalSeasons(showData.number_of_seasons);

                    if (seasonParam) {
                        const seasonResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonParam}?api_key=${apiKey}`);
                        const seasonData = await seasonResponse.json();
                        setTotalEpisodes(seasonData.episodes.length);
                    }
                } catch (error) {
                    console.error('Error fetching season data:', error);
                }
            };

            fetchSeasonData();
        }
    }, [id, type, location.pathname]);

    useEffect(() => {
        if (!isMobile) {
            const timer = setTimeout(() => {
                setButtonGridOpacity(0);
            }, 2000);
            setTimeoutId(timer);

            return () => clearTimeout(timer);
        }
    }, [isMobile]);

    const handleMouseEnter = () => {
        if (!isMobile) {
            setButtonGridOpacity(1);
            if (timeoutId) clearTimeout(timeoutId);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            const timer = setTimeout(() => {
                setButtonGridOpacity(0);
            }, 2000);
            setTimeoutId(timer);
        }
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
            <div id="iframe-container">
                <iframe 
                    src={
                        type === 'tv' 
                        ? `https://vidsrc.pro/embed/${type}/${id}/${season}/${episode}`
                        : `https://vidsrc.pro/embed/${type}/${id}`
                    } 
                    allowFullScreen={true}
                    style={{ width: "100%", height: "100%" }}
                ></iframe>
            </div>
            <div 
                id="button-grid" 
                style={{ opacity: buttonGridOpacity, transition: 'opacity 0.25s' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link to={`/info/${type}/${id}`} id="player-button"><img src="/arrowl.svg" alt="Back" /></Link>
                {type === 'tv' && season && episode && (
                    <Link to={nextEpisodeLink} id="player-button"><img src="/arrowr.svg" alt="Next" /></Link>
                )}
            </div>
        </>
    );
}
