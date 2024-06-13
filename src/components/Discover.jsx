import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

export default function App(props) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(props.url);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.url]);

  const handleCarouselButtonClick = (direction, carouselRef) => {
    const carousel = carouselRef.current;
    const cards = carousel.querySelectorAll('.card');
    const cardWidth = cards[0].offsetWidth;

    if (direction === 'prev') {
      const newPosition = carousel.scrollLeft - (2 * cardWidth);
      carousel.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    } else if (direction === 'next') {
      const newPosition = carousel.scrollLeft + (2 * cardWidth);
      carousel.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const carouselRef = useRef(null);

  return (
    <div id="discover-section">
      <p id="discover-title">{props.name}</p>
      <div id="discover-main">
        <button
          className="carousel-btn prev-btn"
          onClick={() => handleCarouselButtonClick('prev', carouselRef)}
        >
          &lt;
        </button>
        <div className="discover-card" ref={carouselRef}>
          {movies.map((item, index) => (
            <Card key={index} item={item} type={props.type} />
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
