import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';

SwiperCore.use([Autoplay]);

export default function Hero() {
    const [heroItems, setHeroItems] = useState([]);
    const [logoImages, setLogoImages] = useState({});
    const [videos, setVideos] = useState({});
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [loadedStates, setLoadedStates] = useState({});

    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        async function fetchHeroes() {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_video=true`);
                const data = await response.json();
                setHeroItems(data.results);

                const logoImages = {};
                const videos = {};
                const loadedStates = {};

                for (const movie of data.results) {
                    const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${apiKey}`);
                    const imagesData = await imagesResponse.json();
                    const logo = imagesData.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
                    logoImages[movie.id] = logo;

                    loadedStates[movie.id] = { isImageLoaded: false, isVideoLoaded: false };

                    if (logo) {
                        const img = new Image();
                        img.src = `https://image.tmdb.org/t/p/w500${logo}`;
                        img.onload = () => handleImageLoad(movie.id);
                    }

                    const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`);
                    const videoData = await videoResponse.json();
                    const firstVideo = videoData.results.find(video => video.type === "Trailer")?.key;
                    videos[movie.id] = firstVideo;

                    if (firstVideo) {
                        loadedStates[movie.id].isVideoLoaded = true;
                    }
                }

                setLogoImages(logoImages);
                setVideos(videos);
                setLoadedStates(loadedStates);

            } catch (error) {
                console.error('Error fetching heroes:', error);
            }
        }

        fetchHeroes();

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

    const handleImageLoad = (movieId) => {
        setLoadedStates(prevState => ({
            ...prevState,
            [movieId]: { ...prevState[movieId], isImageLoaded: true }
        }));
    };

    return (
        <Swiper
            centeredSlides={true}
            autoplay={{
                delay: 15000,
                disableOnInteraction: false
            }}
            loop={true}
            id="swiper"
        >
            {heroItems.map((heroItem) => (
                <SwiperSlide key={heroItem.id}>
                    <div id='hero'>
                        <div
                            id="hero-image-container"
                            style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`,
                                opacity: 0.3
                            }}
                        >
                            {!isSmallScreen && loadedStates[heroItem.id]?.isVideoLoaded && (
                                <iframe
                                    id="hero-video"
                                    src={`https://www.youtube-nocookie.com/embed/${videos[heroItem.id]}?mute=1&autoplay=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=${videos[heroItem.id]}`}
                                    title={heroItem.title}
                                    frameBorder="0"
                                    allowFullScreen
                                    style={{
                                        opacity: loadedStates[heroItem.id]?.isImageLoaded ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out'
                                    }}
                                    onLoad={() => handleImageLoad(heroItem.id)}
                                />
                            )}
                        </div>
                        <div id="hero-card">
                            <div id="hero-content">
                                <div id="hero-title">
                                    {isSmallScreen || !loadedStates[heroItem.id]?.isImageLoaded ? (
                                        <span id="hero-title-text" className="alt-text">
                                            {heroItem.title}
                                        </span>
                                    ) : (
                                        <img 
                                            src={logoImages[heroItem.id] && `https://image.tmdb.org/t/p/w500${logoImages[heroItem.id]}`} 
                                            id="hero-title-image" 
                                            alt={heroItem.title} 
                                            onLoad={() => handleImageLoad(heroItem.id)}
                                            style={{ display: loadedStates[heroItem.id]?.isImageLoaded ? 'block' : 'none' }}
                                        />
                                    )}
                                </div>
                                <div id="hero-desc">
                                    <p>{heroItem.overview}</p>
                                </div>
                                <div id="hero-buttons">
                                    <div id="hero-watch">
                                        <Link to={`/watch/movie/${heroItem.id}`} id="hero-button">
                                            <img style={{width: "16px"}} src="/images/play.svg" alt="play-icon"/>Watch
                                        </Link>
                                    </div>
                                    <div id="hero-more">
                                        <Link to={`/info/movie/${heroItem.id}`} id="hero-button">
                                            <img style={{width: "20px"}} src="/images/info.svg" alt="info-icon"/>Info
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}