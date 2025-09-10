'use client';

import Link from 'next/link';
import fetchInfo from '@/app/lib/fetchInfo';
import fetchEpisodes from '@/app/lib/fetchEpisodes';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Image from "next/image";
import Footer from '@/app/components/Footer';
import Card, { CardData } from '@/app/components/Card';
import { supabase } from "@/utils/supabase";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Genre {
  id: number;
  name: string;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
}

type Recommendation = CardData & {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
}

interface ReleaseDateInfo {
  iso_3166_1: string;
  rating?: string;
  release_dates?: { certification?: string }[];
}

interface ProviderResults {
  [country: string]: unknown;
}

interface InfoData {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  logo?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  genres?: Genre[];
  seasons?: Season[];
  recommendations?: { results: Recommendation[] };
  release_dates?: { results: ReleaseDateInfo[] };
  content_ratings?: { results: ReleaseDateInfo[] };
  ['watch/providers']?: { results: ProviderResults };
}

interface Episode {
  id: number;
  name: string;
  overview?: string;
  still_path?: string;
  vote_average?: number;
  air_date?: string;
  runtime?: number;
  season_number: number;
  episode_number: number;
}

interface EpisodesResponse {
  episodes: Episode[];
}


export default function Info() {
  const [info, setInfo] = useState<InfoData | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<EpisodesResponse | null>(null);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const params = useParams<{ type: string; id: string }>();
  const type = params.type;
  const id = Number(params.id);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);
  
  useEffect(() => {
    async function fetchInfoData() {
      const result = await fetchInfo(type, id);
      document.title = `${result.title || result.name} - zmov`;

      setInfo(result);
    }
    fetchInfoData();
  }, [type, id]);

  useEffect(() => {
    if (!info?.seasons) {
      setEpisodes(null);
      return;
    }

    async function fetchEpisodeData() {
      const result = await fetchEpisodes(id, selectedSeason);

      setEpisodes(result);
    }
    fetchEpisodeData();
  }, [id, selectedSeason, info?.seasons]);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.pageYOffset === 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchWatchedItem() {
      const { data } = await supabase
        .from('watchedItem')
        .select('*')
        .eq('userId', user?.id)
        .eq('itemId', id)
        .eq('type', type)
        .single();

      if (data) {
        setEpisode(data.episode);
        setSeason(data.season);
      }
    }
    fetchWatchedItem();
  }, [id, type, user?.id]);

  return (
    <>
      <Header />
        {info?.id ? (
          <>
            <div key={info.id} className='flex justify-center items-center w-screen h-screen gap-10 text-center'>
            <div className='-z-10 fixed w-full h-full'>
              <Image 
                fill
                className={`object-cover transition-all duration-500 ${isAtTop ? 'opacity-35' : 'opacity-25'} ${isAtTop ? 'blur-0' : 'blur-xs'}`}
                src={`https://image.tmdb.org/t/p/w1920/${info.backdrop_path}`}
                alt='Backdrop'
              />
            </div>
            <Image 
              width={300}
              height={450}
              className='rounded-xl shadow-lg max-xl:hidden' 
              src={`https://image.tmdb.org/t/p/w300/${info.poster_path}`} 
              alt="Poster"
            />
            <div className='flex flex-col justify-center items-center mx-4 max-w-[600px] gap-3'>
              <Image 
                height={300}
                width={500}
                src={`https://image.tmdb.org/t/p/w500/${info.logo}`}
                alt='Logo'
                className="h-full"
              />
              <div className='flex items-center gap-3 font-semibold'>
                <div className='flex items-center gap-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width='16px' height='16px'>
                    <path fill='#ffffff' d="M112 0c8.8 0 16 7.2 16 16V64H320V16c0-8.8 7.2-16 16-16s16 7.2 16 16V64h32c35.3 0 64 28.7 64 64v32 32V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 160 128C0 92.7 28.7 64 64 64H96V16c0-8.8 7.2-16 16-16zM416 192H32V448c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V192zM384 96H64c-17.7 0-32 14.3-32 32v32H416V128c0-17.7-14.3-32-32-32zM96 368c0-8.8 7.2-16 16-16H240c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zm16-112H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
                  </svg>
                  <p>{info.release_date ?? info.first_air_date}</p>
                </div>
                <div className='flex items-center gap-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width='16px' height='16px'>
                    <path fill='#efb100' d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                  </svg>
                  <p>{info.vote_average?.toFixed(1)}</p>
                </div>
                <p className='border border-white/50 rounded-lg px-1'>{(() => { const ratingInfo = (info.release_dates ?? info.content_ratings)?.results.find((r) => r.iso_3166_1 === 'US'); return type === 'tv' ? ratingInfo?.rating || 'NR' : ratingInfo?.release_dates?.[0]?.certification || 'NR'; })()}</p>
                <p>{Object.keys(info['watch/providers']?.results ?? {}).length ? "HD" : "CAM"}</p>
              </div>
              <div className='flex justify-center flex-wrap gap-2'>
                {info.genres?.map(genre => (
                  <div className="px-2 py-1 rounded-md bg-[#6d0000cc] text-red-400 shadow-[1px_2px_20px_#000]" key={genre.id}>{genre.name}</div>
                ))}
              </div>
              <p className='line-clamp-[8] text-white/85 text-[1.1rem] leading-6'>{info.overview}</p>
              <Link href={`/watch/${type === 'tv' ? 'tv' : 'movie'}/${id}/${type === 'tv' ? `/${season}/${episode}` : ''}`}>
                <button className='flex justify-center items-center gap-2 w-[120px] h-[50px] cursor-pointer bg-white rounded-lg text-xl font-bold border-0 transition-all hover:bg-white/50'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width='20px' height='20px'>
                    <path fill="#000000" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                  </svg>
                  <p className='text-black'>Play</p>
                </button>
              </Link>
            </div>
          </div>
          {(info.seasons?.length ?? 0) >= 1 && (
          <div className='relative top-[-12vh] bg-none flex flex-col w-full items-center'>
            <div className='flex flex-col gap-2 mx-4 max-sm:mx-2 max-w-[1400px] my-4 border border-white/30 bg-white/5 backdrop-blur-lg rounded-xl p-2'>
              <select className='p-2 bg-white/10 border border-white/10 rounded-lg text-left pl-4 text-2xl' value={selectedSeason} onChange={e => setSelectedSeason(parseInt(e.target.value))}>
                {info.seasons?.map(item => (
                  <option key={item.id} value={item.season_number} className='text-black font-mono'>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className='w-full max-h-[70vh] overflow-scroll grid grid-cols-3 max-3xl:grid-cols-2 max-xl:grid-cols-1 gap-2'>
                {episodes?.episodes?.map(episode => (
                  <Link href={`/watch/${type}/${id}/${type === 'tv' ? `/${episode.season_number}/${episode.episode_number}` : ''}`} key={episode.id} prefetch={false}>
                    <div className="flex max-sm:flex-col max-sm:gap-2 cursor-pointer items-center border border-white/15 p-1 rounded-lg">
                      <Image 
                        width={500}
                        height={281}
                        className='w-[180px] max-3xl:w-[200px] max-xl:w-[300px] max-md:w-[225px] max-sm:w-[500px] rounded-md'
                        src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                        alt='Episode'
                      />
                      <div className="ml-4 max-sm:mx-2">
                        <p className='text-xl font-bold line-clamp-1'>{episode.name}</p>
                        <div className='flex text-white/50 items-center'>
                          <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16px" height="16px"><path fill='#efb100' d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
                          <p className='mr-2'>{episode.vote_average?.toFixed(1)}</p>
                          <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#dddddd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                          <p className='mr-2'>{episode.air_date}</p>
                          <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" fill='#dddddd' width='16px' height='16px' viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                          <p>{episode.runtime ? `${Math.floor(episode.runtime / 60)}h ${episode.runtime % 60}m` : ''}</p>
                        </div>
                        <p className='line-clamp-2 max-xl:line-clamp-4 max-md:line-clamp-3 text-white/65'>{episode.overview}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          )}
          <div className='relative top-[-12vh] flex justify-center w-full mt-12'>
            <div className='max-w-[1400px] mx-4 grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-md:p-3 max-sm:mx-2 max-xs:border-0 max-xs:p-0 max-xs:bg-white/0 max-xs:backdrop-blur-none max-xs:gap-3 gap-4 border border-white/30 bg-white/5 backdrop-blur-lg rounded-xl p-4'>
              {info.recommendations?.results.map(rec => (
                <Card key={rec.id} data={rec} />
              ))}
            </div>
          </div>
          </>
        ) : (
          <div key={info?.id} className='flex justify-center items-center w-screen h-screen text-center'>
            <svg stroke="#ff3838" width='60' height='60' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>
          </div>
        )}
          
      <Footer />
    </>
  );
}