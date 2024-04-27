/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Wishlist from '@/utils/Wishlist';

import EpisodeT from '@/types/Episode';
import MediaType from '@/types/MediaType';
import Movie from '@/types/Movie';
import Series from '@/types/Series';
import Continue from '@/types/Continue';

import Card from './Card';
import Episode from './Episode';

interface TitleProps {
  type: string;
  id: string;
}

export default function Title({ type, id }: TitleProps) {
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<Movie | Series>();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<EpisodeT[]>();
  const [maxEpisodes, setMaxEpisodes] = useState(1);

  const [wished, setWished] = useState(false);
  const [extendSuggestions, setExtendSuggestions] = useState(false);
  const [extendEpisodes, setExtendEpisodes] = useState(false);

  function getYear(date: string) {
    const timestamp = Date.parse(date);
    return new Date(timestamp).getFullYear();
  }

  function getLength(runtime: number) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (!hours) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }

  async function getData() {
    const req = await fetch(import.meta.env.VITE_APP_API + '/' + type + '/' + id);
    const res = await req.json();

    if (!res.success) {
      nav('/');
      return;
    }

    const data = res.data;

    setData(data);

    if (type !== 'series') return;

    const cont = localStorage.getItem('continue_' + id);

    if (!cont) {
      getEpisodes();
      return;
    }

    const parsed: Continue = JSON.parse(cont);

    setSeason(parsed.season);
    setEpisode(parsed.episode);

    getEpisodes(parsed.season);
  }

  async function getEpisodes(season: number = 1) {
    const req = await fetch(`${import.meta.env.VITE_APP_API}/episodes/${id}?s=${season}`);
    const res = await req.json();

    if (!res.success) {
      nav('/');
      return;
    }

    const data = res.data;

    setEpisodes(data);
    setMaxEpisodes(data.length);
  }

  function onSeasonChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEpisodes(undefined);

    const s = parseInt(e.target.value);

    setSeason(s);
    getEpisodes(s);
  }

  function onPlusClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;
    if (type !== 'movie' && type !== 'series') return;

    Wishlist.add({ id: data.id, poster: data.images.poster, title: data.title, type });
  }

  function onCheckClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;

    Wishlist.remove(data.id, type as MediaType);
  }

  function onWindowClick(e: MouseEvent) {
    if (!ref.current) return;

    if (e.target === ref.current) {
      nav('/');
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    window.addEventListener('click', onWindowClick);

    return () => {
      document.body.style.overflow = 'auto';

      window.removeEventListener('click', onWindowClick);
    };
  }, []);

  useEffect(() => {
    if (isNaN(parseInt(id))) {
      return nav('/');
    }

    if (type !== 'movie' && type !== 'series') {
      return nav('/');
    }

    setData(undefined);
    setEpisodes(undefined);

    setExtendEpisodes(false);
    setExtendSuggestions(false);

    getData();

    return () => {
      setData(undefined);
    };
  }, [type, id]);

  useEffect(() => {
    if (!data) return;

    setWished(Wishlist.has(data.id, type as MediaType));

    function onWishlistChange() {
      if (!data) return;

      setWished(Wishlist.has(data.id, type as MediaType));
    }

    Wishlist.on(data.id, type, onWishlistChange);

    return () => {
      Wishlist.off(data.id, type, onWishlistChange);
    };
  }, [data]);

  if (!data) {
    return <div className="title" ref={ref}></div>;
  }

  return (
    <>
      <Helmet>
        <title>
          {data.title} - {import.meta.env.VITE_APP_NAME}
        </title>
      </Helmet>

      <div className="title" ref={ref}>
        <div className="title-container">
          <div className="title-close" onClick={() => nav('/')}>
            <i className="fa-light fa-close"></i>
          </div>

          <div
            className="title-backdrop"
            style={{
              backgroundImage: `url(${data.images.backdrop})`
            }}
          ></div>

          <div className="title-content">
            <div className="title-logo">
              <img alt={data.title} src={data.images.logo} />
            </div>

            <div className="title-actions">
              <Link className="button" to={`/watch/${id}${type === 'series' ? `?s=${season}&e=${episode}` : ''}`}>
                <i className="fa-solid fa-play"></i>
                <span>{type === 'series' ? `S${season} E${episode}` : 'Play'}</span>
              </Link>

              {wished ? (
                <button className="button" onClick={onCheckClick}>
                  <i className="fa-solid fa-check"></i>
                </button>
              ) : (
                <button className="button secondary" onClick={onPlusClick}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              )}
            </div>

            <div className="title-grid">
              <div className="title-col">
                {data.tagline && <h4 className="title-tagline">{data.tagline}</h4>}

                <div className="title-meta">
                  <span className="title-rating">{data.rating}%</span>

                  <span>{getYear(data.date)}</span>

                  {'runtime' in data && <span>{getLength(data.runtime)}</span>}

                  {'seasons' in data && <span>{data.seasons} Seasons</span>}
                </div>

                <p className="title-description">{data.description}</p>
              </div>

              <div className="title-col">
                <div className="title-list">
                  <span className="head">Genres:</span>
                  {data.genres.map((genre, i) => (
                    <Link to={`/genre/${type}/${genre.id}`} key={i}>
                      {genre.name}
                      {i < data.genres.length - 1 && ','}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {'seasons' in data && (
              <div className="title-section">
                <div className="title-row">
                  <h3>Episodes</h3>

                  <select className="title-select" defaultValue={season} onChange={onSeasonChange}>
                    {Array.from({ length: data.seasons }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        Season {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="title-episodes">
                  {episodes &&
                    episodes.map((episode, i) => {
                      if (!extendEpisodes && i > 9) return null;

                      return <Episode key={i} {...episode} id={data.id} season={season} maxEpisodes={maxEpisodes} />;
                    })}
                </div>

                {episodes && episodes.length > 10 && (
                  <div className={`title-extend ${extendEpisodes ? 'active' : ''}`}>
                    <button className="button secondary" onClick={() => setExtendEpisodes(!extendEpisodes)}>
                      {extendEpisodes ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {data.suggested.length > 0 && (
              <div className="title-section">
                <h3>More Like This</h3>

                <div className="title-cards">
                  {data.suggested.map((media, i) => {
                    if (!extendSuggestions && i > 7) return null;

                    return <Card key={i} {...media} />;
                  })}
                </div>

                {data.suggested.length > 8 && (
                  <div className={`title-extend ${extendSuggestions ? 'active' : ''}`}>
                    <button className="button secondary" onClick={() => setExtendSuggestions(!extendSuggestions)}>
                      {extendSuggestions ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
