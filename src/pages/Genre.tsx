/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '@/components/Card';
import Loading from '@/components/Loading';

import MediaShort from '@/types/MediaShort';

export default function Genre() {
  const nav = useNavigate();

  const { id, type } = useParams();

  const [data, setData] = useState<MediaShort[]>();
  const [title, setTitle] = useState<string>();

  function getCapitalized(str: string) {
    const words = str.split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }

    return words.join(' ');
  }

  async function getData() {
    if (!id || !type) {
      nav('/');
      return;
    }

    if (type !== 'movie' && type !== 'series') {
      nav('/');
      return;
    }

    if (!parseInt(id)) {
      nav('/');
      return;
    }

    const req = await fetch(`${import.meta.env.VITE_APP_API}/genre/${type}/${id}`);
    const res = await req.json();

    if (!res.success) {
      nav('/');
      return;
    }

    const data = res.data;

    setData(data.items);
    setTitle(data.title);
  }

  useEffect(() => {
    getData();
  }, [name, type]);

  if (!data) {
    return <Loading />;
  }

  if (!id || !type) {
    nav('/');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {getCapitalized(`${title} ${type === 'movie' ? 'movies' : type}`)} - {import.meta.env.VITE_APP_NAME}
        </title>
      </Helmet>

      <div className="page">
        <h1 className="page-title">{getCapitalized(`${title} ${type === 'movie' ? 'movies' : type}`)}</h1>

        <div className="page-cards">
          {data.map(media => (
            <Card key={media.id + media.type} {...media} />
          ))}
        </div>
      </div>
    </>
  );
}
