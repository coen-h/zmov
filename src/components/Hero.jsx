import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'
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
        const fetchHeroes = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&append_to_response=release_dates&include_adult=false`);
                const data = await response.json();
                setHeroItems(data.results);

                const promises = data.results.map(async (movie) => {
                    const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${apiKey}`);
                    const imagesData = await imagesResponse.json();
                    const logo = imagesData.logos.find(logo => logo.iso_639_1 === "en")?.file_path;

                    if (logo) {
                        setLogoImages(prevState => ({ ...prevState, [movie.id]: logo }));
                    }

                    const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`);
                    const videoData = await videoResponse.json();
                    const firstVideo = videoData.results.find(video => video.type === "Trailer")?.key;

                    setVideos(prevState => ({ ...prevState, [movie.id]: firstVideo }));
                    setLoadedStates(prevState => ({
                        ...prevState,
                        [movie.id]: {
                            isImageLoaded: false,
                            isVideoLoaded: !!firstVideo
                        }
                    }));
                });

                await Promise.all(promises);

            } catch (error) {
                console.error('Error fetching heroes:', error);
            }
        };

        fetchHeroes();

        const mediaQuery = window.matchMedia('(max-width: 1100px), (max-height: 600px)');
        const handleMediaChange = (e) => setIsSmallScreen(e.matches);

        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, [apiKey]);

    const handleImageLoad = (movieId) => {
        setLoadedStates(prevState => ({
            ...prevState,
            [movieId]: { ...prevState[movieId], isImageLoaded: true }
        }));
    };

    const preloadNext = (swiper, n) => {
        const startIndex = swiper.activeIndex;
        const endIndex = startIndex + n + 1;
        swiper.slides.slice(startIndex, endIndex)
            .forEach(slide => {
                const iframe = slide.querySelector('iframe');
                iframe && iframe.setAttribute('loading', 'lazy');
            });
    };

    const swiperParams = {
        centeredSlides: true,
        autoplay: {
            delay: 15000,
            disableOnInteraction: false
        },
        loop: heroItems.length > 1,
        onSlideChange: (swiper) => preloadNext(swiper, 2),
        onInit: (swiper) => preloadNext(swiper, 2),
        id: "swiper"
    };

    return (
        <Swiper {...swiperParams}>
            {heroItems.map((heroItem) => (
                <SwiperSlide key={heroItem.id}>
                    <div id='hero'>
                        <div
                            id="hero-image-container"
                            style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`,
                                opacity: 0.4
                            }}
                        >
                            {!isSmallScreen && loadedStates[heroItem.id]?.isVideoLoaded && (
                                <iframe
                                    id="hero-video"
                                    src={`https://www.youtube.com/embed/${videos[heroItem.id]}?mute=1&autoplay=1&loop=1&rel=0&fs=0&controls=0&disablekb=1&playlist=${videos[heroItem.id]}&origin=https://watch.coen.ovh`}
                                    title={heroItem.title}
                                    allowFullScreen
                                    loading="lazy"
                                    style={{
                                        opacity: loadedStates[heroItem.id]?.isImageLoaded ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out',
                                        border: '0',
                                    }}
                                    onLoad={() => handleImageLoad(heroItem.id)}
                                />
                            )}
                        </div>
                        <div id="hero-card">
                            <div id="hero-content">
                                <div id="hero-title">
                                    <span id="hero-title-text" className="alt-text">
                                        {heroItem.title}
                                    </span>
                                    <img 
                                        src={logoImages[heroItem.id] && `https://image.tmdb.org/t/p/w500${logoImages[heroItem.id]}`} 
                                        id="hero-title-image" 
                                        alt={heroItem.title} 
                                    />
                                </div>
                                <div id="hero-bar">
                                    <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
                                        <i style={{color: "#F9c000"}} className="fa-solid fa-star fa-xs"></i>
                                        <p>{parseFloat(heroItem.vote_average).toFixed(1)}</p>
                                    </div>
                                    <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
                                        <i className="fa-light fa-calendar-lines"></i>
                                        <p>{heroItem.release_date}</p>
                                    </div>
                                    <p style={{outline: "rgba(255,255,255,0.5) 1px solid", padding: "2px 4px", borderRadius: "6px"}}>{(heroItem.original_language).toUpperCase()}</p>
                                </div>
                                <div id="hero-desc">
                                    <p>{heroItem.overview}</p>
                                </div>
                                <div id="hero-buttons">
                                    <div id="hero-watch">
                                        <Link to={`/watch/movie/${heroItem.id}`} id="hero-play">
                                            <i className="fa-solid fa-play" style={{color: "#000000", fontSize: "1.2rem"}} alt="Play Icon" /><p style={{color: "#000000"}}>Watch</p>
                                        </Link>
                                    </div>
                                    <div id="hero-more">
                                        <Link to={`/info/movie/${heroItem.id}`} id="hero-button">
                                            <i className="fa-regular fa-circle-info" style={{ fontSize: "18px" }} alt="info-icon" /><p>Info</p>
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