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
        const append_to_response = type === 'tv' ? 'content_ratings,images,recommendations' : 'release_dates,images,recommendations,credits';
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
        <div className="loader">
          <img src='/images/icon.svg' alt="Loading..." />
        </div>
      ) : data.error ? (
        <div className="error">
          <p>{data.error}</p>
        </div>
      ) : (
        <>
          <div id="info-container">
            <img id="info-backdrop" style={{ opacity: isTop ? "0.35" : "", filter: isTop ? "blur(0px)" : "" }} src={data.item.backdrop_path && `https://image.tmdb.org/t/p/original${data.item.backdrop_path}`} alt="Backdrop" />
            <img id="info-poster" src={data.item.poster_path && `https://image.tmdb.org/t/p/w500/${data.item.poster_path}`} alt="Poster" />
            <div id="info-top">
              <img id="info-title" src={data.logoImage && `https://image.tmdb.org/t/p/w500${data.logoImage}`} alt={type === 'movie' ? data.item.title : data.item.name} />
              <p id="info-title-text">{type === 'movie' ? data.item.title : data.item.name}</p>
              <div id="info-bar">
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                  <i className="fa-light fa-calendar-lines"></i>
                  <p id="info-date">{type === 'tv' ? data.item.first_air_date : data.item.release_date}</p>
                </div>
                <div id="info-rating-bar">
                  <i className="fa-solid fa-star" style={{fontSize: "11px", color: "#F9c000"}} alt="Star Icon" />
                  <p id="info-rating">{parseFloat(data.item.vote_average).toFixed(1)}</p>
                </div>
                <p id="info-content-rating">{getContentRating()}</p>
              </div>
              <div id="info-genres">
                {data.genres.map(genre => (
                  <div className="genre-box" key={genre.id}>{genre.name}</div>
                ))}
              </div>
              <p id="info-description">{data.item.overview}</p>
              <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
                <Link to={getPlayLink()}>
                  <button id="play-button">
                    <i className="fa-solid fa-play" style={{fontSize: "18px"}} alt="Play Icon" /><p>Play</p>
                  </button>
                </Link>
                <button style={{width: "auto", height: "auto", padding: "0.5rem"}} id="watch-button" onClick={toggleWatchlist}>
                  <i style={{fontSize: "28px", padding: "0 5px"}} className={isInWatchlist ? "fa-light fa-minus" : "fa-light fa-plus"} alt="Watchlist Icon"></i>
                </button>
              </div>
            </div>
          </div>
          <div style={{background: "none"}}>
            {data.isSeries && (
              <>
                <div id="season-container">
                  <select id="season-selector" value={data.selectedSeason} onChange={handleSeasonChange}>
                    {data.seasons.map(season => (
                      <option key={season.id} value={season.season_number}>{season.name}</option>
                    ))}
                  </select>
                </div>
                <div id="episodes-container">
                  {data.episodes?.map(episode => (
                    <Link to={`/watch/${type}/${id}/${data.selectedSeason}/${episode.episode_number}`} key={episode.id}>
                      <div className="episode-box">
                        <img id="episode-image" src={episode.still_path && `https://image.tmdb.org/t/p/w500${episode.still_path}`} alt={`Episode ${episode.episode_number}`} />
                        <div className="episode-content">
                          <p style={{fontSize: "1.25rem", fontWeight: "bold"}}>{episode.name}</p>
                          <p id="episode-desc">{episode.overview}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
            <p id="suggested-title">You may also like</p>
            <div id="suggested-container">
              {data.recommendations.map(recommendation => (
                <Card key={recommendation.id} csize="mcard" size="mimage" item={recommendation} type={type} />
              ))}
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
}