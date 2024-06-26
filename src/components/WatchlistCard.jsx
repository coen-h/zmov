import React from 'react';
import { Link } from 'react-router-dom';

export default function WatchlistCard({ item, type, onRemove }) {
  const removeItem = (event, id) => {
    event.preventDefault();
    const updatedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const updatedItems = updatedWatchlist.filter(item => item.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(updatedItems));
    onRemove(id);
  };

  return (
    <div className="watch-card">
      <Link to={`/info/${type}/${item.id}`} className="watch-card-link">
        <img className="watch-card-image" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt="Poster" />
        <div className="watchlist-content">
          <div className="card-play"><i className="fa-solid fa-play" style={{color: "#ffffff", fontSize: "2.5rem"}} alt="Play Icon" /></div>
          <button id="watchlist-button" onClick={(event) => removeItem(event, item.id)}>
            <img src="/images/trash.svg" alt="Remove" />
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
};