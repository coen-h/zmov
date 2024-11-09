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
        <Link to={`/info/${props.type}/${props.item.id}`} className={`card group ${props.size} ${isLoaded ? 'opacity-100' : 'opacity-0'} flex relative h-full rounded-lg text-base transition-all duration-200`} ref={cardRef}>
            <img
                className={`h-full rounded-lg transition-all duration-200 group-hover:scale-105`}
                src={props.item.poster_path && `https://image.tmdb.org/t/p/w500/${props.item.poster_path}`}
                alt="Poster"
            />
            <div className="card-play group-hover:opacity-100 absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 transition-opacity duration-200 z-20">
                <i className="fa-solid fa-play text-white text-[2.5rem]" alt="Play Icon" />
            </div>
            <div className="card-content group-hover:scale-105 group-hover:opacity-100 max-xl:opacity-100 absolute top-0 left-0 w-full h-full flex justify-end flex-col items-center opacity-0 text-center font-semibold transition-all duration-200 bg-gradient-to-t from-black rounded-md shadow-inner shadow-black z-10">
                <p className="card-title text-lg font-bold leading-[1.4rem] line-clamp-2">{props.type === 'movie' ? props.item.title : props.item.name}</p>
                <div className="card-desc flex font-normal text-sm gap-[2px] mb-[10px] *:text-[#b4b4b4]">
                    <p>{props.type === 'tv' ? 'TV' : props.type.charAt(0).toUpperCase() + props.type.slice(1)}</p>
                    <p>&#x2022;</p>
                    <p>{(props.type === 'movie' ? props.item.release_date : props.type === 'tv' ? props.item.first_air_date : '').slice(0, 4)}</p>
                    <p>&#x2022;</p>
                    <p>{(props.item.original_language).toUpperCase()}</p>
                </div>
                <div className='flex items-center gap-1 bg-black/50 py-[2px] px-[5px] rounded-s-md absolute top-[10px] right-0'>
                    <i className="fa-solid fa-star fa-xs text-yellow-500"></i>
                    <p className='font-normal'>{parseFloat(props.item.vote_average).toFixed(1)}</p>
                </div>
            </div>
        </Link>
    );
}