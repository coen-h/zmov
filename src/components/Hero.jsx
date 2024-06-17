import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    const [heroItem, setHeroItem] = useState('');
    const [logoImage, setLogoImage] = useState('');

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        async function fetchHero() {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`);
                const data = await response.json();
                const firstMovie = data.results[0];
                setHeroItem(firstMovie);

                const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}/images?api_key=${apiKey}`);
                const imagesData = await imagesResponse.json();
                const logo = imagesData.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
                setLogoImage(logo);
            } catch (error) {
                console.error('Error fetching hero:', error);
            }
        }

        fetchHero();
    }, []);

    return (
        <div id='hero'>
            <img id="hero-image" src={heroItem.backdrop_path && `https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`} alt="Hero image"/>
            <div id="hero-card">
                <div id="hero-content">
                    <div id="hero-title">
                        <img src={logoImage && `https://image.tmdb.org/t/p/w500${logoImage}`} id="hero-title-image" alt={heroItem.title}/>
                        <span id="hero-title-text" class="alt-text">{heroItem.title}</span>
                    </div>
                    <div id="hero-desc">
                        <p>{heroItem.overview}</p>
                    </div>
                    <div id="hero-buttons">
                        <div id="hero-watch">
                            <Link to={`/watch/movie/${heroItem.id}`} id="hero-button"><img style={{width: "16px"}} src="/play.svg" alt="play-icon"/>Watch</Link>
                        </div>
                        <div id="hero-more">
                            <Link to={`/info/movie/${heroItem.id}`} id="hero-button"><img style={{width: "20px"}} src="/info.svg" alt="info-icon"/>Info</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
