import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const searchInputRef = useRef();

    function handleSearch() {
        const query = searchInputRef.current.value;
        if (query) {
            navigate(`/search/${query}`);
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div id="header">
            <div id="header-section">
                <div id="header-left">
                    <Link to="/">
                        <img src="/logo.svg" id="header-logo" alt="Logo" />
                    </Link>
                </div>
                <div id="header-right">
                    <button id="settings">
                        <Link to="/settings">
                            <img id="settings-icon" src="/settings.svg" alt="Settings" />
                        </Link>
                    </button>
                    <div id="search">
                        <input
                            type="text"
                            id="search-input"
                            required
                            placeholder="Type to search..."
                            ref={searchInputRef}
                            onKeyPress={handleKeyPress}
                        />
                        <div className="icon" onClick={handleSearch}>
                            <img id="search-icon" src="/search.svg" alt="Search" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}