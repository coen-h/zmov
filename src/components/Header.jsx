import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const searchInputRef = useRef();
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

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

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > lastScrollTop) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    return (
        <div id="header" className={isVisible ? 'visible' : 'show'}>
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