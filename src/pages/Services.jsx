import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import LoadingBar from 'react-top-loading-bar';
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Services() {
  const [movies, setMovies] = useState([]);
  const { service } = useParams();
  const loadingBarRef = useRef(null);
  let name = ''

  const apiKey = import.meta.env.VITE_API_KEY;
  let url = '';

  if (service === 'netflix') {
    url = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=8&api_key=${apiKey}`;
    name = 'Netflix';
  } else if (service === 'disney') {
    url = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=337&api_key=${apiKey}`;
    name = 'Disney+';
  } else if (service === 'apple') {
    url = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=350&api_key=${apiKey}`;
    name = 'Apple TV+';
  } else if (service === 'prime') {
    url = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=9&api_key=${apiKey}`;
    name = 'Prime Video';
  } else if (service === 'max') {
    url = `https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=1899&api_key=${apiKey}`;
    name = 'HBO Max';
  }

  useEffect(() => {
    const fetchData = async () => {
      if (loadingBarRef.current) loadingBarRef.current.continuousStart();
      try {
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (loadingBarRef.current) loadingBarRef.current.complete();
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return (
    <>
      <LoadingBar color="#FF0000" ref={loadingBarRef} />
      <Header />
      <div id="service-section">
      <p id="service-title">{name}</p>
        <div className="service-content">
          {movies.map((item, index) => (
            <Card key={index} item={item} type='movie' csize="big-card" size="big-image"/>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
