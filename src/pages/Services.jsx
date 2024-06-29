import React, { useState, useEffect, useRef } from 'react';
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
      <div id="service-section">
        <p id="service-title">{name}</p>
        <div className="service-content">
          {movies.map((item, index) => (
            <Card key={index} item={item} type='movie' csize="big-card" size="big-image" />
          ))}
        </div>
        <div id="service-button-grid">
          <button id="service-button" style={{borderRadius: "8px 0 0 8px"}} onClick={handleFarBack} disabled={page === 1}>
            <i className="fa-solid fa-chevrons-left" />
          </button>
          <button id="service-button" onClick={handleBack} disabled={page === 1}>
            <i className="fa-solid fa-angle-left" />
          </button>
          <span id="service-span">{page}</span>
          <button id="service-button" onClick={handleNext} disabled={page >= totalPage}>
            <i className="fa-solid fa-angle-right" />
          </button>
          <button id="service-button" style={{borderRadius: "0 8px 8px 0"}} onClick={handleFarNext} disabled={page >= totalPage}>
            <i className="fa-solid fa-chevrons-right" />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}