import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InstallButton from './InstallButton';

export default function Header() {
  const navigate = useNavigate();
  const searchInputRef = useRef();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTop, setIsTop] = useState(true);

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
      
      if (currentScrollTop === 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }

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
    <div id="header" className={`${isVisible ? 'visible' : 'show'} ${isTop ? 'no-filter' : 'with-filter'}`}>
      <div id="header-section">
        <div id="header-left">
          <Link to="/">
            <img src="/images/logo.svg" id="header-logo" alt="Logo" />
          </Link>
        </div>
        <div id="header-right">
          <InstallButton />
          <div id="search">
            <input
              type="text"
              id="search-input"
              required
              placeholder="Type to search..."
              ref={searchInputRef}
              onKeyPress={handleKeyPress}
            />
            <div className="icon">
              <i className="fa-regular fa-magnifying-glass" alt="Search" style={{fontSize: "25px", padding: "2px 0 0 2px"}} />
            </div>
          </div>
          <button id="settings">
            <Link to="/settings">
              <i className="fa-light fa-gear" alt="Settings" style={{ fontSize: "30px" }} />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}