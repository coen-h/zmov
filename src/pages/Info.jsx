import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import LoadingBar from 'react-top-loading-bar';
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Info() {
  const { type, id } = useParams();
  const [data, setData] = useState({
    item: {},
    logoImage: '',
    genres: [],
    recommendations: [],
    isSeries: false,
    seasons: [],
    selectedSeason: '',
    episodes: [],
    isLoading: true,
    error: null,
  });
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const loadingBarRef = useRef(null);
  const [isTop, setIsTop] = useState(true);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    setData((prevData) => ({ ...prevData, isLoading: true, error: null }));
  }, [type, id]);

  useEffect(() => {
    document.title = 'Loading - zmov';
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (loadingBarRef.current) loadingBarRef.current.continuousStart();
      try {
        const append_to_response = type === 'tv' ? 'content_ratings,images,recommendations,credits,watch/providers' : 'release_dates,images,recommendations,credits,watch/providers';
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=${append_to_response}&include_adult=false`);
        const result = await response.json();
        const logo = result.images.logos.find(logo => logo.iso_639_1 === "en")?.file_path;
        const isSeries = type === 'tv';
        const seasons = isSeries ? result.seasons.filter(season => season.season_number !== 0) : [];
        const selectedSeason = isSeries && seasons.length > 0 ? seasons[0].season_number : '';

        document.title = `${result.title || result.name} - zmov`;

        setData({
          item: result,
          logoImage: logo,
          genres: result.genres,
          recommendations: result.recommendations.results,
          isSeries,
          seasons,
          selectedSeason,
          episodes: [],
          isLoading: false,
          error: null,
        });

        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const inWatchlist = watchlist.some(item => item.id === result.id);
        setIsInWatchlist(inWatchlist);

      } catch (error) {
        console.error('Error fetching data:', error);
        setData(prevData => ({ ...prevData, isLoading: false, error: 'Error fetching data' }));
      } finally {
        if (loadingBarRef.current) loadingBarRef.current.complete();
      }
    };

    fetchData();
  }, [type, id, apiKey]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (type === 'tv' && data.selectedSeason !== '') {
        if (loadingBarRef.current) loadingBarRef.current.continuousStart();
        try {
          const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${data.selectedSeason}?api_key=${apiKey}`);
          const result = await response.json();
          setData(prevData => ({ ...prevData, episodes: result.episodes, error: null }));
        } catch (error) {
          console.error('Error fetching episodes:', error);
          setData(prevData => ({ ...prevData, episodes: [], error: 'Error fetching episodes' }));
        } finally {
          if (loadingBarRef.current) loadingBarRef.current.complete();
        }
      }
    };

    fetchEpisodes();
  }, [type, id, data.selectedSeason, apiKey]);

  const getContentRating = () => {
    if (type === 'tv') {
      return data.item.content_ratings?.results.find(r => r.iso_3166_1 === 'US')?.rating || 'NR';
    } else {
      return data.item.release_dates?.results.find(r => r.iso_3166_1 === 'US')?.release_dates[0]?.certification || 'NR';
    }
  };

  const handleSeasonChange = (e) => {
    setData(prevData => ({ ...prevData, selectedSeason: e.target.value }));
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movie = {
      id: data.item.id,
      item: data.item,
      type
    };

    if (isInWatchlist) {
      const updatedWatchlist = watchlist.filter(item => item.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(false);
    } else {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
    }
  };

  const getPlayLink = () => {
    if (type === 'tv') {
      const continueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
      const itemInContinueWatching = continueWatching.find(item => item.id === id && item.type === 'tv');
      
      if (itemInContinueWatching) {
        const { season, episode } = itemInContinueWatching;
        return `/watch/${type}/${id}/${season}/${episode}`;
      } else {
        return `/watch/${type}/${id}/1/1`;
      }
    } else {
      return `/watch/${type}/${id}`;
    }
  };  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop === 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Header />
      <LoadingBar color="#FF0000" ref={loadingBarRef} />
      {data.isLoading ? (
        <div className="w-screen h-screen flex grayscale justify-center items-center">
          <img className='w-[100px] animate-loaderImg' src='/images/icon.svg' alt="Loading..." />
        </div>
      ) : data.error ? (
        <div className="w-screen h-screen flex grayscale justify-center items-center">
          <p className='text-2xl font-bold'>{data.error}</p>
        </div>
      ) : (
        <>
          <div className='flex justify-center items-center w-screen h-screen gap-12 text-center'>
            <img className={`${isTop ? 'blur-0' : 'blur-sm'} ${isTop ? 'opacity-35' : 'opacity-25'} z-[-2] fixed top-0 w-full h-full object-cover transition-all duration-500`} src={data.item.backdrop_path && `https://image.tmdb.org/t/p/original${data.item.backdrop_path}`} alt="Backdrop" />
            <img className='w-[300px] rounded-xl z-[12] shadow-lg max-2xl:hidden' src={data.item.poster_path && `https://image.tmdb.org/t/p/w500/${data.item.poster_path}`} alt="Poster" />
            <div className='flex flex-col justify-center items-center p-[10px] w-[600px] gap-4 z-[11] [@media(max-height:500px)]:gap-3'>
              <img className='max-w-[90vw] max-h-[35vh] text-[2.5rem] font-semibold [@media(max-height:500px)]:hidden' src={data.logoImage && `https://image.tmdb.org/t/p/w500${data.logoImage}`} alt={type === 'movie' ? data.item.title : data.item.name} />
              <p className='hidden text-[2.5rem] font-semibold [@media(max-height:500px)]:block'>{type === 'movie' ? data.item.title : data.item.name}</p>
              <div className='flex items-center gap-3 font-semibold'>
                <div className='flex items-center gap-1'>
                  <i className="fa-light fa-calendar-lines"></i>
                  <p>{type === 'tv' ? data.item.first_air_date : data.item.release_date}</p>
                </div>
                <div className='flex items-center gap-[2px]'>
                  <i className="fa-solid fa-star text-xs text-yellow-500" alt="Star Icon" />
                  <p>{parseFloat(data.item.vote_average).toFixed(1)}</p>
                </div>
                <p className='border border-solid border-white border-opacity-50 rounded-lg px-1'>{getContentRating()}</p>
                <p>{Object.keys(data.item["watch/providers"]?.results || {}).length > 0 ? "HD" : "CAM"}</p>
              </div>
              <div className='flex justify-center flex-wrap gap-2 [@media(max-height:500px)]:hidden'>
                {data.genres.map(genre => (
                  <div className="genre-box px-2 py-1 rounded-md bg-[#6d0000cc] text-red-400 shadow-[1px_2px_20px_#000]" key={genre.id}>{genre.name}</div>
                ))}
              </div>
              <p className='line-clamp-[8] text-white text-opacity-85 text-[1.1rem] leading-6 max-md:text-base max-md:leading-5 [@media(max-height:500px)]:text-base [@media(max-height:500px)]:leading-5'>{data.item.overview}</p>
              <div className='flex gap-2'>
                <Link to={getPlayLink()}>
                  <button className='flex justify-center items-center gap-2 w-[120px] h-[50px] cursor-pointer bg-white rounded-lg text-xl font-bold border-0 transition-all duration-150 hover:bg-opacity-50'>
                    <i className="fa-solid fa-play text-black text-lg" alt="Play Icon" /><p className='text-black'>Play</p>
                  </button>
                </Link>
                <button className='flex justify-center items-center gap-2 cursor-pointer bg-white bg-opacity-20 rounded-lg text-xl font-bold border-0 transition-all duration-150 hover:bg-opacity-40 w-auto h-auto p-2' onClick={toggleWatchlist}>
                  <i className={`${isInWatchlist ? "fa-light fa-minus" : "fa-light fa-plus"} text-3xl py-0 px-1`} alt="Watchlist Icon"></i>
                </button>
              </div>
            </div>
          </div>
          <div className='bg-none'>
            {data.isSeries && (
              <>
                <div className='flex justify-start pl-[16vw] max-xl:pl-[10vw] max-lg:pl-[2vw] max-xs:pr-[2vw]'>
                  <select className='bg-white bg-opacity-10 rounded-lg border-0 text-left pl-4 text-2xl w-[208px] h-[50px] max-xs:w-full focus:bg-gray-800 active:bg-gray-800' value={data.selectedSeason} onChange={handleSeasonChange}>
                    {data.seasons.map(season => (
                      <option key={season.id} value={season.season_number}>{season.name}</option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col gap-6 overflow-y-scroll max-h-[50vh] mx-[16vw] max-xl:mx-[10vw] max-lg:mx-[2vw] mt-4 mb-24 border-2 border-solid border-white border-opacity-30 bg-white bg-opacity-5 backdrop-blur-lg rounded-lg p-2'>
                  {data.episodes?.map(episode => (
                    <Link to={`/watch/${type}/${id}/${data.selectedSeason}/${episode.episode_number}`} key={episode.id}>
                      <div className="episode-box flex cursor-pointer items-center max-lg:flex-col max-lg:border-b max-lg:pb-4 max-lg:border-gray-400">
                        <img className='w-[200px] rounded-lg max-lg:w-[50vw] max-lg:mb-2 max-md:w-full' src={episode.still_path && `https://image.tmdb.org/t/p/w500${episode.still_path}`} alt={`Episode ${episode.episode_number}`} />
                        <div className="episode-content ml-6 max-lg:ml-0">
                          <p className='text-xl font-bold'>{episode.name}</p>
                          <p className='text-base line-clamp-4'>{episode.overview}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
            <p className='text-[2.1rem] text-center font-bold mt-8 mb-5'>You may also like</p>
            <div className='flex justify-center items-center flex-wrap mx-[16vw] mt-4 mb-8 gap-[1vw] z-10 max-xl:mx-[8vw] max-lg:mx-[2vw] max-lg:gap-[2vw]'>
              {data.recommendations.map(recommendation => (
                <Card key={recommendation.id} size="w-[16.1vw] max-xl:w-[20.1vw] max-lg:w-[30.5vw] max-md:w-[46.8vw]" item={recommendation} type={type} />
              ))}
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
}