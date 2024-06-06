import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

export default function App(props) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWU5ZjI2ZTdkYjI5NzA4NWQ1YzE1ZTdlYTRmMTVkYiIsInN1YiI6IjY1ZDkyNGExMzUyMGU4MDE2M2Q2M2NiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lYIevteIqCBbc7_IRsdBmdFtLOtaVC3PwSmLGTOElMU'
        }
      };

      try {
        const response = await fetch(props.url, options);
        const data = await response.json();
        console.log(data)
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCarouselButtonClick = (direction, carouselRef) => {
    const carousel = carouselRef.current;
    const cards = carousel.querySelectorAll('.card');
    const cardWidth = cards[0].offsetWidth;

    if (direction === 'prev') {
      const newPosition = carousel.scrollLeft - (3 * cardWidth);
      carousel.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    } else if (direction === 'next') {
      const newPosition = carousel.scrollLeft + (3 * cardWidth);
      carousel.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <div id="discover-section" className="discover-section">
      <p id="discover-title">{props.name}</p>
      <div id="discover-main">
        <button
          className="carousel-btn prev-btn"
          onClick={() => handleCarouselButtonClick('prev', carouselRef)}
        >
          &lt;
        </button>
        <div id="discover-card1" className="discover-card" ref={carouselRef}>
          {movies.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
        <button
          className="carousel-btn next-btn"
          onClick={() => handleCarouselButtonClick('next', carouselRef)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
