import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div id="notfound">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" id="notfound-link">Home</Link>
        </div>
    );
};

export default NotFound;
