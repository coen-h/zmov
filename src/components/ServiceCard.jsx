import React from 'react'
import { Link } from 'react-router-dom';

export default function ServiceCard(props) {
    return (
        <Link to={`/service/${props.type}`} className="service-card" style={props.style}>
            <img style={{width: "100%"}} src={`${props.img}`} alt="Service Image"/>
        </Link>
    )
}