import React from 'react'

export default function Card(props) {
    return (
        <div className="card">
            <img src={`https://image.tmdb.org/t/p/w500/${props.item.poster_path}`} alt={props.item.title} />
            <div className="card-play"><img className="play-icon" src="../src/assets/play.png"></img></div>
            <p className="card-content">{props.item.title}</p>
        </div>
      );
}