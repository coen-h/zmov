import React, { useState, useEffect } from 'react';

export default function Hero() {
    const [heroItem, setHeroItem] = useState('');
    const [logoImage, setLogoImage] = useState('');

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWU5ZjI2ZTdkYjI5NzA4NWQ1YzE1ZTdlYTRmMTVkYiIsInN1YiI6IjY1ZDkyNGExMzUyMGU4MDE2M2Q2M2NiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lYIevteIqCBbc7_IRsdBmdFtLOtaVC3PwSmLGTOElMU'
            }
        };

        async function fetchHero() {
            try {
                const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
                const data = await response.json();
                const firstMovie = data.results[0];
                setHeroItem(firstMovie);

                const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}/images`, options);
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
            <img id="hero-image" src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`} alt={heroItem.title} />
            <div id="hero-card">
                <div id="hero-content">
                    <div id="hero-title">
                        <img src={`https://image.tmdb.org/t/p/original${logoImage}`} id="hero-title-image" alt={heroItem.title} />
                    </div>
                    <div id="hero-desc">
                        <p>{heroItem.overview}</p>
                    </div>
                    <div id="hero-buttons">
                        <div id="hero-watch">
                            <button id="hero-button">Watch</button>
                        </div>
                        <div id="hero-more">
                            <button id="hero-button">Info</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
