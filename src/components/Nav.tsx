/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';

export default function Nav() {
  const nav = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  function onScroll() {
    const scrolled = window.scrollY > 0;

    setScrolled(scrolled);
  }

  function onSearchClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();

    setSearching(true);
  }

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const param = searchParams.get('q');

    setSearch(value);

    if (!value) {
      nav('/');
      return;
    }

    if (!param) {
      nav(`/search?q=${value}`);
      return;
    }

    searchParams.set('q', value);
    setSearchParams(searchParams);
  }

  useEffect(() => {
    if (searchParams.has('q')) setSearch(searchParams.get('q')!);

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!searching) return;
    if (!inputRef.current) return;

    inputRef.current.focus();

    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearching(false);
      }
    }

    window.addEventListener('click', onClick, { capture: true });

    return () => {
      window.removeEventListener('click', onClick, { capture: true });
    };
  }, [searching]);

  return (
    <div className={`top-bar ${scrolled ? 'scrolled' : ''}`}>
      <Link className="top-bar-logo" to="/">
        <img alt={import.meta.env.VITE_APP_NAME} src="/logo.png" />
      </Link>

      <div className="top-bar-links">
        <NavLink to="/">Browse</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/series">Series</NavLink>
        <NavLink to="/list">My List</NavLink>

        <NavLink className="mobile" to="/movies">
          <i className="fa-regular fa-film"></i>
        </NavLink>

        <NavLink className="mobile" to="/series">
          <i className="fa-regular fa-tv"></i>
        </NavLink>

        <NavLink className="mobile" to="/list">
          <i className="fa-regular fa-list"></i>
        </NavLink>
      </div>

      <div className="top-bar-search" ref={wrapperRef}>
        {searching ? (
          <div className="top-bar-input">
            <i className="fa-regular fa-search"></i>

            <input type="text" ref={inputRef} value={search} placeholder="Search for a title" onChange={onSearchChange} />
          </div>
        ) : (
          <i className="fa-regular fa-search action" onClick={onSearchClick}></i>
        )}
      </div>
    </div>
  );
}
