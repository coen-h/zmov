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
    <div className="watch-card flex relative w-[12vw] h-full rounded-lg text-base transition-all duration-200 ease-in-out overflow-hidden">
      <Link to={`/info/${type}/${item.id}`} className="watch-card-link group">
        <img className="watch-card-image group-hover:scale-105 w-[12vw] h-full rounded-lg transition-all duration-200 ease-in-out" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt="Poster" />
        <div className="watchlist-content absolute top-0 left-0 w-full h-full flex justify-end  flex-col items-center text-center font-semibold transition-all duration-200 ease-in-out bg-gradient-to-t from-black rounded-md z-10 shadow-lg">
          <div className="card-play group-hover:opacity-100"><i className="fa-solid fa-play group-hover:opacity-100 text-white text-[2.5rem]" alt="Play Icon" /></div>
          <button id="watchlist-button" onClick={(event) => removeItem(event, item.id)}>
            <i className="fa-light fa-trash-can" style={{fontSize: "18px", color: "#000000"}} alt="Remove" />
          </button>
          <p className="card-title">{type === 'movie' ? item.title : item.name}</p>
          <div className="card-desc">
            <p>{type === 'tv' ? 'TV' : type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p>&#x2022;</p>
            <p>{(type === 'movie' ? item.release_date : item.first_air_date).slice(0, 4)}</p>
            <p id="check">&#x2022;</p>
            <p id="check">{item.original_language.toUpperCase()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}