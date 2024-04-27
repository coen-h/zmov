/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Collection from '@/components/Collection';
import Loading from '@/components/Loading';

import Hero from '@/types/Hero';
import CollectionT from '@/types/Collection';

export default function Full() {
  const nav = useNavigate();

  const { type } = useParams();

  const [hero, setHero] = useState<Hero>();
  const [collections, setCollections] = useState<CollectionT[]>();

  function getCapitalized() {
    return type === 'movies' ? 'Movies' : 'Series';
  }

  async function getData() {
    if (!type) {
      nav('/');
      return;
    }

    if (type !== 'movies' && type !== 'series') {
      nav('/');
      return;
    }

    const req = await fetch(`${import.meta.env.VITE_APP_API}/${type === 'movies' ? 'movie' : 'series'}`);
    const res = await req.json();

    if (!res.success) {
      return;
    }

    const data = res.data;

    setCollections(data.collections);
    setHero(data.hero);
  }

  useEffect(() => {
    setHero(undefined);
    setCollections(undefined);

    getData();
  }, [type]);

  if (!collections || !hero) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>
          {getCapitalized()} - {import.meta.env.VITE_APP_NAME}
        </title>
      </Helmet>

      <div
        className="hero"
        style={{
          backgroundImage: `url(${hero.images.backdrop})`
        }}
      >
        <div className="hero-content">
          <img className="hero-logo" alt={hero.title} src={hero.images.logo} />

          <p className="hero-text">{hero.description.length > 200 ? hero.description.slice(0, 160).trim() + '...' : hero.description}</p>

          <div className="hero-actions">
            <Link className="button" to={`/watch/${hero.id}${hero.type === 'series' ? '?s=1&e=1' : ''}`}>
              <i className="fa-solid fa-play"></i>
              <span>Play</span>
            </Link>

            <Link className="button secondary" to={`/${hero.type}/${hero.id}`}>
              <i className="fa-regular fa-circle-info"></i>
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="collections overlap">
        {collections.map((collection, index) => (
          <Collection key={index} title={collection.title} items={collection.items} />
        ))}
      </div>
    </>
  );
}
