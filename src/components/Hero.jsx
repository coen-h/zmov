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
                    <div id='hero' className='flex h-screen'>
                        <div
                            id="hero-image-container"
                            style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`,
                            }}
                            className='absolute w-screen h-screen overflow-hidden z-[-1] opacity-40'
                        >
                            {!isSmallScreen && loadedStates[heroItem.id]?.isVideoLoaded && (
                                <iframe
                                    id="hero-video"
                                    src={`https://www.youtube.com/embed/${videos[heroItem.id]}?mute=1&autoplay=1&loop=1&rel=0&fs=0&controls=0&disablekb=1&playlist=${videos[heroItem.id]}&origin=https://watch.coen.ovh`}
                                    title={heroItem.title}
                                    allowFullScreen
                                    loading="lazy"
                                    className={`absolute w-[150vw] h-[200vh] top-[-50%] left-[-25%] object-cover border-none transition-opacity duration-500 ease-in ${loadedStates[heroItem.id]?.isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => handleImageLoad(heroItem.id)}
                                />
                            )}
                        </div>
                        <div id="hero-card" className='flex flex-col justify-end mb-[22vh]'>
                            <div id="hero-content" className='flex flex-col ml-12 z-[1] gap-1'>
                                <div id="hero-title" className='text-[4rem] font-semibold mb-3'>
                                    <span id="hero-title-text" className="alt-text hidden">
                                        {heroItem.title}
                                    </span>
                                    <img 
                                        src={logoImages[heroItem.id] && `https://image.tmdb.org/t/p/w500${logoImages[heroItem.id]}`} 
                                        id="hero-title-image" 
                                        className='max-w-[60vw] max-h-[30vh]'
                                        alt={heroItem.title} 
                                    />
                                </div>
                                <div id="hero-bar" className='flex gap-[10px]'>
                                    <div className='flex items-center gap-1'>
                                        <i className="fa-solid fa-star fa-xs text-[#F9c000]"></i>
                                        <p>{parseFloat(heroItem.vote_average).toFixed(1)}</p>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <i className="fa-light fa-calendar-lines"></i>
                                        <p>{heroItem.release_date}</p>
                                    </div>
                                    <p className='py-[1px] px-[4px] outline-1 outline outline-gray-400 rounded-md'>{(heroItem.original_language).toUpperCase()}</p>
                                </div>
                                <div id="hero-desc" className='text-[1.05rem] w-[40vw] leading-6'>
                                    <p>{heroItem.overview}</p>
                                </div>
                                <div id="hero-buttons" className='flex gap-2 mt-2'>
                                    <div id="hero-watch">
                                        <Link to={`/watch/movie/${heroItem.id}`} id="hero-play" className='flex items-center gap-2 px-4 py-2  bg-white rounded-lg text-xl font-bold border-none transition-all duration-150 ease-in-out hover:bg-opacity-50'>
                                            <i className="fa-solid fa-play text-black text-xl" alt="Play Icon" /><p className='text-black'>Watch</p>
                                        </Link>
                                    </div>
                                    <div id="hero-more">
                                        <Link to={`/info/movie/${heroItem.id}`} id="hero-button" className='flex items-center gap-[10px] px-4 py-2 bg-white bg-opacity-20 rounded-lg text-xl font-bold border-none transition-all duration-150 ease-in-out hover:bg-opacity-40'>
                                            <i className="fa-regular fa-circle-info text-xl" alt="info-icon" /><p>Info</p>
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