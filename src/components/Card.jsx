import React from 'react';
import { Link } from 'react-router-dom';

export default function Card(props) {
    return (
        <Link to={`/info/${props.type}/${props.item.id}`} className="card" id={props.csize}>
            <img className={props.size} src={props.item.poster_path && `https://image.tmdb.org/t/p/w500/${props.item.poster_path}`} alt="Poster" />
            <div className="card-play"><img className="play-icon" src="/images/play.svg" alt="Play Icon"/></div>
            <div className="card-content">
                <p className="card-title">{props.type === 'movie' ? props.item.title : props.item.name}</p>
                <div className="card-desc">
                    <p>{props.type === 'tv' ? 'TV' : props.type.charAt(0).toUpperCase() + props.type.slice(1)}</p>
                    <p>&#x2022;</p>
                    <p>{(props.type === 'movie' ? props.item.release_date : props.item.first_air_date).slice(0, 4)}</p>
                    <p id="check">&#x2022;</p>
                    <p id="check">{(props.item.original_language).toUpperCase()}</p>
                </div>
            </div>
        </Link>
    );
}