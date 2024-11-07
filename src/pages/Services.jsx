import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import LoadingBar from 'react-top-loading-bar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Services() {
  const [movies, setMovies] = useState([]);
  const [totalPage, setTotalPage] = useState(500);
  const [page, setPage] = useState(1);
  const { service } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const loadingBarRef = useRef(null);
  let name = '';
  document.title = `${service.charAt(0).toUpperCase() + service.slice(1)} - zmov`;

  const apiKey = import.meta.env.VITE_API_KEY;
  let baseUrl = '';

  if (service === 'netflix') {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=8&api_key=${apiKey}&include_adult=false`;
    name = 'Netflix';
  } else if (service === 'disney') {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=337&api_key=${apiKey}&include_adult=false`;
    name = 'Disney+';
  } else if (service === 'apple') {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=350&api_key=${apiKey}&include_adult=false`;
    name = 'Apple TV+';
  } else if (service === 'prime') {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=9&api_key=${apiKey}&include_adult=false`;
    name = 'Prime Video';
  } else if (service === 'max') {
    baseUrl = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=1899&api_key=${apiKey}&include_adult=false`;
    name = 'HBO Max';
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentPage = parseInt(searchParams.get('page')) || 1;
    setPage(currentPage);
    setMovies([]);

    const fetchData = async () => {
      if (loadingBarRef.current) loadingBarRef.current.continuousStart();
      try {
        const response = await fetch(`${baseUrl}&page=${currentPage}`);
        const data = await response.json();
        setMovies(data.results);
        setTotalPage(data.total_pages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (loadingBarRef.current) loadingBarRef.current.complete();
      }
    };

    if (baseUrl) {
      fetchData();
    }
  }, [baseUrl, location.search]);

  const handleFarNext = () => {
    navigate(`?page=${totalPage}`);
  };
  const handleNext = () => {
    const nextPage = page + 1;
    navigate(`?page=${nextPage}`);
  };
  const handleBack = () => {
    if (page > 1) {
      const prevPage = page - 1;
      navigate(`?page=${prevPage}`);
    }
  };
  const handleFarBack = () => {
    navigate(`?page=1`);
  };

  return (
    <>
      <LoadingBar color="#FF0000" ref={loadingBarRef} />
      <Header />
      <div className='min-h-screen mx-[18vw] pt-20 max-xl:mx-[10vw] max-lg:mx-[4vw] max-md:mx-[3vw]'>
        <p className='text-[3rem] font-bold text-center mb-4'>{name}</p>
        <div className='flex justify-center flex-wrap gap-[1.2vw] max-md:gap-[2vw]'>
          {movies.map((item, index) => (
            <Card key={index} item={item} type='movie' size="w-[20.3vw] max-xl:w-[25.6vw] max-lg:w-[29.6vw] max-md:w-[45.7vw]" />
          ))}
        </div>
        <div className='flex justify-center items-center mt-[30px] gap-[2px]'>
          <button className='group flex items-center gap-2 font-bold text-lg border-none transition-all duration-150 cursor-ponter bg-white bg-opacity-30 px-5 py-[10px] rounded-l-lg disabled:cursor-default disabled:bg-opacity-15' onClick={handleFarBack} disabled={page === 1}>
            <i className="fa-solid fa-chevrons-left enabled:group-hover:text-[#ff4f4f]" />
          </button>
          <button className='group flex items-center gap-2 font-bold text-lg border-none transition-all duration-150 cursor-ponter bg-white bg-opacity-30 px-5 py-[10px] disabled:cursor-default disabled:bg-opacity-15' onClick={handleBack} disabled={page === 1}>
            <i className="fa-solid fa-angle-left enabled:group-hover:text-[#ff4f4f]" />
          </button>
          <span className='flex items-center py-2 px-4 bg-white bg-opacity-30'>{page}</span>
          <button className='group flex items-center gap-2 font-bold text-lg border-none transition-all duration-150 cursor-ponter bg-white bg-opacity-30 px-5 py-[10px] disabled:cursor-default disabled:bg-opacity-15' onClick={handleNext} disabled={page >= totalPage}>
            <i className="fa-solid fa-angle-right enabled:group-hover:text-[#ff4f4f]" />
          </button>
          <button className='group flex items-center gap-2 font-bold text-lg border-none transition-all duration-150 cursor-ponter bg-white bg-opacity-30 px-5 py-[10px] rounded-r-lg disabled:cursor-default disabled:bg-opacity-15' onClick={handleFarNext} disabled={page >= totalPage}>
            <i className="fa-solid fa-chevrons-right enabled:group-hover:text-[#ff4f4f]" />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}