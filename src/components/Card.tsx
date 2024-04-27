/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Wishlist from '@/utils/Wishlist';

import MediaShort from '@/types/MediaShort';
import Continue from '@/types/Continue';

interface CardProps extends MediaShort {
  Ref?: React.RefObject<HTMLAnchorElement>;
}

export default function Card({ id, poster, title, type, Ref }: CardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const nav = useNavigate();

  const [active, setActive] = useState(false);
  const [wished, setWished] = useState(false);

  const [episode, setEpisode] = useState(1);
  const [season, setSeason] = useState(1);

  function getContinue() {
    if (type !== 'series') return;

    const cont = localStorage.getItem(`continue_${id}`);

    if (!cont) return;

    const parsed: Continue = JSON.parse(cont);

    setEpisode(parsed.episode);
    setSeason(parsed.season);
  }

  function onCardHover() {
    if (active) return;

    setActive(true);
  }

  function onCardLeave() {
    if (!active) return;

    setActive(false);
  }

  function onCardClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (active) return;

    e.preventDefault();

    setActive(true);
  }

  function onWindowClick(e: MouseEvent) {
    if (!active) return;

    if ((Ref || ref).current?.contains(e.target as Node)) return;

    setActive(false);
  }

  function onPlusClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    Wishlist.add({ id, poster, title, type });
  }

  function onCheckClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    Wishlist.remove(id, type);
  }

  function onChevronClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    nav(`/${type}/${id}`);
  }

  useEffect(() => {
    getContinue();

    setWished(Wishlist.has(id, type));

    function onWishlistChange() {
      setWished(Wishlist.has(id, type));
    }

    Wishlist.on(id, type, onWishlistChange);

    return () => {
      Wishlist.off(id, type, onWishlistChange);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('click', onWindowClick);

    return () => {
      window.removeEventListener('click', onWindowClick);
    };
  }, [active]);

  return (
    <Link
      ref={Ref || ref}
      className={`media-card ${active ? 'active' : ''}`}
      to={`/watch/${id}${type === 'series' ? `?s=${season}&e=${episode}` : ''}`}
      onClick={onCardClick}
      onMouseOver={onCardHover}
      onMouseLeave={onCardLeave}
    >
      <img src={poster} alt={title} loading="lazy" />

      <div className="media-card-actions">
        <button className="button">
          <i className="fa-solid fa-play"></i>
        </button>

        {wished ? (
          <button className="button" onClick={onCheckClick}>
            <i className="fa-solid fa-check"></i>
          </button>
        ) : (
          <button className="button secondary" onClick={onPlusClick}>
            <i className="fa-solid fa-plus"></i>
          </button>
        )}

        <button className="button secondary right" onClick={onChevronClick}>
          <i className="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </Link>
  );
}
