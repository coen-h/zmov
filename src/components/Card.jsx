import React from 'react';
import { Link } from 'react-router-dom';

export default function Card(props) {
    return (
        <Link to={`/info/${props.type}/${props.item.id}`} className="card">
            <img className={props.size} src={props.item.poster_path && `https://image.tmdb.org/t/p/w500/${props.item.poster_path}`}/>
            <div className="card-play"><img className="play-icon" src="/play.svg"></img></div>
            <p className="card-content">{props.type === 'movie' ? props.item.title : props.item.name}</p>
        </Link>
    );
}
