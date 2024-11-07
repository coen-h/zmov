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
    <div id="header" className={`flex fixed h-20 max-md:h-16 w-screen z-[1111] transition-all duration-300 bg-gradient-to-b from-gray-950 ${isVisible ? 'max-xl:top-0' : 'max-xl:top-[-100px]'} ${isTop ? 'backdrop-blur-0' : 'backdrop-blur-sm'}`}>
      <div id="header-section" className='flex justify-between items-center flex-grow my-4 mx-12 gap-1 max-md:my-0 max-md:mx-[11px] max-xs:justify-center'>
        <div id="header-left">
          <Link to="/">
            <img src="/images/logo.svg" id="header-logo" className='w-[100px] transition-all duration-150 east-in-out mt-1 hover:opacity-60 scale-[0.97] max-xs:hidden' alt="Logo" />
            <img src="/images/icon.svg" id="header-logo" className='w-[46px] transition-all duration-150 east-in-out mt-1 hover:opacity-60 scale-[0.97] xs:hidden block' alt="Logo" />
          </Link>
        </div>
        <div id="header-right" className='flex gap-2'>
          <InstallButton />
          <div id="search" className='relative transition-all duration-150 hover:opacity-80'>
            <input
              type="text"
              id="search-input"
              className='pl-10 h-[42px] w-[200px] max-xs:w-[60vw] text-base border-0 outline-none transition-all duration-300 bg-white bg-opacity-20 shadow-[1px_1px_3px_#0e0e0e,-1px_-1px_3px_#5f5e5e40,inset_0_0_#0e0e0e,inset_0_-0px_#5f5e5e] rounded-[50px] cursor-text'
              required
              placeholder="Type to search..."
              ref={searchInputRef}
              onKeyPress={handleKeyPress}
            />
            <div className="icon absolute w-[200px] max-xs:w-[60vw] h-[42px] top-0 left-0 p-[6px] pointer-events-none">
              <i className="fa-regular fa-magnifying-glass text-2xl pt-[2px] pl-[2px]" alt="Search"/>
            </div>
          </div>
          <button id="settings" className='w-[42px] h-[42px] pt-[2px] bg-white bg-opacity-20 border-none rounded-[50%] shadow-lg transition-all duration-150 hover:scale-95 hover:rotate-45'>
            <Link to="/settings">
              <i className="fa-light fa-gear text-3xl" alt="Settings" />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}