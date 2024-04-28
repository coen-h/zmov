/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Wishlist from '@/utils/Wishlist';

import MediaShort from '@/types/MediaShort';
import Continue from '@/types/Continue';

interface CardProps extends MediaShort {
  Ref?: React.RefObject<HTMLAnchorElement>;
}

export default function Card({ id, poster, title, type, Ref }: CardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const [active, setActive] = useState(false);
  const [setWished] = useState(false);

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
      to={`/${type}/${id}${type === 'series' ? `?s=${season}&e=${episode}` : ''}`}
      onClick={onCardClick}
      onMouseOver={onCardHover}
      onMouseLeave={onCardLeave}
    >
      <img src={poster} alt={title} loading="lazy" />
    </Link>
  );
}
