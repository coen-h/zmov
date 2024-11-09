import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

WatchlistCard.propTypes = {
  item: PropTypes.string.isRequired,
  onRemove: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default function WatchlistCard({ item, type, onRemove }) {
  const removeItem = (event, id) => {
    event.preventDefault();
    const updatedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const updatedItems = updatedWatchlist.filter(item => item.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(updatedItems));
    onRemove(id);
  };

  return (
    <div className="watch-card flex relative w-[14.2vw] max-2xl:w-[17.2vw] max-xl:w-[28.4vw] max-lg:w-[43.3vw] max-md:w-[45.87vw] h-full rounded-lg text-base transition-all duration-200 overflow-hidden">
      <Link to={`/info/${type}/${item.id}`} className="watch-card-link group">
        <img className="watch-card-image group-hover:scale-105 h-full transition-all duration-200" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt="Poster" />
        <div className="watchlist-content absolute top-0 left-0 w-full h-full flex justify-end flex-col items-center text-center font-semibold transition-all duration-200 bg-gradient-to-t from-black rounded-md shadow-inner shadow-black">
          <div className="card-play absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 transition-opacity duration-200 z-20 group-hover:opacity-100"><i className="fa-solid fa-play group-hover:opacity-100 text-white text-[2.5rem]" alt="Play Icon" /></div>
          <button className='flex justify-center items-center absolute top-1 right-1 opacity-0 max-xl:opacity-100 w-9 h-9 z-[1111] bg-white/90 border-0 p-0 rounded-lg cursor-pointer transition-all duration-150 group-hover:opacity-100 hover:bg-red-500' onClick={(event) => removeItem(event, item.id)}>
            <i className="fa-light fa-trash-can text-lg text-black" alt="Remove" />
          </button>
          <p className="card-title text-lg font-bold leading-[1.4rem]">{type === 'movie' ? item.title : item.name}</p>
          <div className="card-desc flex font-normal text-sm gap-[2px] mb-[10px] *:text-[#b4b4b4]">
            <p>{type === 'tv' ? 'TV' : type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p>&#x2022;</p>
            <p>{(type === 'movie' ? item.release_date : item.first_air_date).slice(0, 4)}</p>
            <p>&#x2022;</p>
            <p>{item.original_language.toUpperCase()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}