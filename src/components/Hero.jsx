import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    const [heroItem, setHeroItem] = useState('');
    const [logoImage, setLogoImage] = useState('');

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        async function fetchHero() {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
                const data = await response.json();
                const firstMovie = data.results[0];
                setHeroItem(firstMovie);

                const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}/images?api_key=${apiKey}`);
                const imagesData = await imagesResponse.json();
                const logo = imagesData.logos[0]?.file_path;
                setLogoImage(logo);
            } catch (error) {
                console.error('Error fetching hero:', error);
            }
        }

        fetchHero();
    }, []);

    return (
        <div id='hero'>
            <img id="hero-image" src={heroItem.backdrop_path && `https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`} />
            <div id="hero-card">
                <div id="hero-content">
                    <div id="hero-title">
                        <img src={logoImage && `https://image.tmdb.org/t/p/original${logoImage}`} id="hero-title-image" />
                    </div>
                    <div id="hero-desc">
                        <p>{heroItem.overview}</p>
                    </div>
                    <div id="hero-buttons">
                        <div id="hero-watch">
                            <Link to={`/player/movie/${heroItem.id}/1/1`} id="hero-button">Watch</Link>
                        </div>
                        <div id="hero-more">
                            <Link to={`/info/movie/${heroItem.id}`} id="hero-button">Info</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
