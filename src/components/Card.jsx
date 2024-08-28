import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

Card.propTypes = {
  item: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  csize: PropTypes.string.isRequired,
};

export default function Card(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const cardRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsLoaded(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        const element = cardRef.current;
        if (element) {
          observer.observe(element);
        }
      
        return () => {
          if (element) {
            observer.disconnect();
          }
        };
    }, []);

    return (
        <Link to={`/info/${props.type}/${props.item.id}`} className={`card ${isLoaded ? 'loaded' : 'loading'}`} id={props.csize} ref={cardRef}>
            <img
                className={props.size}
                src={props.item.poster_path && `https://image.tmdb.org/t/p/w500/${props.item.poster_path}`}
                alt="Poster"
            />
            <div className="card-play">
                <i className="fa-solid fa-play" style={{ color: "#ffffff", fontSize: "2.5rem" }} alt="Play Icon" />
            </div>
            <div className="card-content">
                <p className="card-title">{props.type === 'movie' ? props.item.title : props.item.name}</p>
                <div className="card-desc">
                    <p>{props.type === 'tv' ? 'TV' : props.type.charAt(0).toUpperCase() + props.type.slice(1)}</p>
                    <p>&#x2022;</p>
                    <p>{(props.type === 'movie' ? props.item.release_date : props.type === 'tv' ? props.item.first_air_date : '').slice(0, 4)}</p>
                    <p id="check">&#x2022;</p>
                    <p id="check">{(props.item.original_language).toUpperCase()}</p>
                </div>
                <div id="card-rating">
                    <i style={{ color: "#F9c000" }} className="fa-solid fa-star fa-xs"></i>
                    <p>{parseFloat(props.item.vote_average).toFixed(1)}</p>
                </div>
            </div>
        </Link>
    );
}