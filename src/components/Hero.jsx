import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    const [heroItem, setHeroItem] = useState('');
    const [logoImage, setLogoImage] = useState('');
    const [video, setVideo] = useState('');

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        async function fetchHero() {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_video=true`);
                const data = await response.json();
                const firstMovie = data.results[0];
                setHeroItem(firstMovie);

                const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}/images?api_key=${apiKey}`);
                const imagesData = await imagesResponse.json();
                const logo = imagesData.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
                setLogoImage(logo);

                const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}/videos?api_key=${apiKey}`)
                const videoData = await videoResponse.json()
                const firstVideo = videoData.results[0];
                console.log(firstVideo)
                setVideo(firstVideo)

            } catch (error) {
                console.error('Error fetching hero:', error);
            }
        }

        fetchHero();
    }, []);

    return (
        <div id='hero'>
            <iframe id="hero-image" src={`https://www.youtube.com/embed/${video.key}?mute=1&autoplay=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=xSeavZfiO0s&origin=http://watch.coen.ovh`} title={heroItem.title} frameBorder="0" />
            <div id="hero-card">
                <div id="hero-content">
                    <div id="hero-title">
                        <img src={logoImage && `https://image.tmdb.org/t/p/w500${logoImage}`} id="hero-title-image" alt={heroItem.title} />
                        <span id="hero-title-text" className="alt-text">{heroItem.title}</span>
                    </div>
                    <div id="hero-desc">
                        <p>{heroItem.overview}</p>
                    </div>
                    <div id="hero-buttons">
                        <div id="hero-watch">
                            <Link to={`/watch/movie/${heroItem.id}`} id="hero-button"><img style={{width: "16px"}} src="/images/play.svg" alt="play-icon"/>Watch</Link>
                        </div>
                        <div id="hero-more">
                            <Link to={`/info/movie/${heroItem.id}`} id="hero-button"><img style={{width: "20px"}} src="/images/info.svg" alt="info-icon"/>Info</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
