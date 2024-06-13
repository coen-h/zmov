import React from 'react'
import { Link } from 'react-router-dom';

export default function ServiceCard(props) {
    return (
        <Link to={`/service/${props.type}`} className="service-card" id={props.type}>
            <img className="service-card-image" src={`${props.img}`} alt="Service Image"/>
        </Link>
    )
}