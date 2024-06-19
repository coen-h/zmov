import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    const [movies, setMovies] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [logoImage, setLogoImage] = useState('');
    const [video, setVideo] = useState('');

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_video=true`);
                const data = await response.json();
                setMovies(data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();

        const mediaQuery = window.matchMedia('(max-width: 1100px), (max-height: 600px)');
        const handleMediaChange = (e) => {
            setIsSmallScreen(e.matches);
        };

        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, [apiKey]);

    useEffect(() => {
        if (movies.length === 0) return;

        const currentMovie = movies[currentMovieIndex];
        fetchMovieDetails(currentMovie.id);

    }, [currentMovieIndex, movies]);

    const fetchMovieDetails = async (movieId) => {
        try {
            const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`);
            const imagesData = await imagesResponse.json();
            const logo = imagesData.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
            setLogoImage(logo);

            const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
            const videoData = await videoResponse.json();
            const firstVideo = videoData.results.find(video => video.type === "Trailer")?.key;
            setVideo(firstVideo);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const nextMovie = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsImageLoaded(false);
        setIsVideoLoaded(false);
    };

    const prevMovie = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
        setIsImageLoaded(false);
        setIsVideoLoaded(false);
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    if (movies.length === 0) {
        return null; // Optionally, display a loading indicator or handle empty state
    }

    const currentMovie = movies[currentMovieIndex];

    return (
        <div id='hero'>
            <div id="hero-image-container">
                {(isSmallScreen || !isImageLoaded || !isVideoLoaded) && (
                    <img
                        id="hero-image"
                        src={currentMovie.backdrop_path && `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
                        alt="Hero image"
                        onLoad={handleImageLoad}
                    />
                )}
                {!isSmallScreen && isImageLoaded && (
                    <iframe
                        id="hero-video"
                        src={`https://www.youtube-nocookie.com/embed/${video}?mute=1&autoplay=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=${video}`}
                        title={currentMovie.title}
                        frameBorder="0"
                        allowFullScreen
                        onLoad={handleVideoLoad}
                    />
                )}
            </div>
            <div id="hero-card">
                <div id="hero-content">
                    <div id="hero-title">
                        <img 
                            src={logoImage && `https://image.tmdb.org/t/p/w500${logoImage}`} 
                            id="hero-title-image" 
                            alt={currentMovie.title} 
                            style={{ display: isImageLoaded ? 'block' : 'none' }}
                        />
                        <span id="hero-title-text" className="alt-text">{currentMovie.title}</span>
                    </div>
                    <div id="hero-desc">
                        <p>{currentMovie.overview}</p>
                    </div>
                    <div id="hero-buttons">
                        <div id="hero-watch">
                            <Link to={`/watch/movie/${currentMovie.id}`} id="hero-button">
                                <img style={{width: "16px"}} src="/images/play.svg" alt="play-icon"/>Watch
                            </Link>
                        </div>
                        <div id="hero-more">
                            <Link to={`/info/movie/${currentMovie.id}`} id="hero-button">
                                <img style={{width: "20px"}} src="/images/info.svg" alt="info-icon"/>Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div id="hero-controls">
                {/* <button onClick={prevMovie}>Previous</button> */}
                {/* <button onClick={nextMovie}>Next</button> */}
            </div>
        </div>
    );
};