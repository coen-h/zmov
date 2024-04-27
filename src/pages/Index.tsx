/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Collection from '@/components/Collection';
import Loading from '@/components/Loading';
import Title from '@/components/Title';

import CollectionT from '@/types/Collection';
import Hero from '@/types/Hero';
import MediaShort from '@/types/MediaShort';

export default function Index() {
  const { type, id } = useParams();

  const [hero, setHero] = useState<Hero>();
  const [collections, setCollections] = useState<CollectionT[]>([]);

  function getViewed() {
    const viewed = localStorage.getItem('viewed');

    if (!viewed) {
      return;
    }

    console.log(viewed);

    const parsed: MediaShort[] = JSON.parse(viewed);

    collections.push({
      title: 'Recently Viewed',
      items: parsed
    });
  }

  async function getData() {
    const req = await fetch(`${import.meta.env.VITE_APP_API}/browse`);
    const res = await req.json();

    if (!res.success) {
      return;
    }

    const data = res.data;

    setCollections(e => [...e, ...data.collections]);
    setHero(data.hero);
  }

  useEffect(() => {
    getViewed();
    getData();
  }, []);

  if (!hero) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div
        className="hero"
        style={{
          backgroundImage: `url(${hero.images.backdrop})`
        }}
      >
        <div className="hero-content">
          <img className="hero-logo" alt={hero.title} src={hero.images.logo} />

          <p className="hero-text">{hero.description.slice(0, 150)}</p>

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

      {type && id && <Title id={id} type={type} />}
    </>
  );
}
