import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

WideCard.propTypes = {
  item: PropTypes.string.isRequired,
  onRemove: PropTypes.string.isRequired,
};

export default function WideCard(props) {
  const removeItem = (event, id) => {
    event.preventDefault();
    const storedContinueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
    const updatedContinueWatching = storedContinueWatching.filter(item => item.id !== id);
    localStorage.setItem('continueWatching', JSON.stringify(updatedContinueWatching));
    props.onRemove(id);
  };

  return (
      <Link to={`/info/${props.item.type}/${props.item.item.id}`} className="widecard">
        <img className="widecard-image" src={props.item.item.backdrop_path && `https://image.tmdb.org/t/p/w500/${props.item.item.backdrop_path}`} alt="Backdrop" />
        <div className="widecard-content">
          <button id="watchlist-button" onClick={(event) => removeItem(event, props.item.id)}>
            <i className="fa-light fa-trash-can" style={{fontSize: "18px", color: "#000000"}} alt="Remove" />
          </button>
          <div style={{padding: "0.5rem"}}>
            <div style={{fontWeight: "300", fontSize: "0.8rem"}}>{props.item.type === 'tv' ? `Watching S${props.item.season} Episode-${props.item.episode}` : ''}</div>
            <p style={{fontSize: "0.9rem", fontWeight: "500"}}>{props.item.type === 'movie' ? props.item.item.title : props.item.item.name}</p>
          </div>
          <div className="widecard-play"><i className="fa-solid fa-play fa-xl" style={{color: "#ffffff"}} alt="Play Icon" /></div>
        </div>
      </Link>
  );
}