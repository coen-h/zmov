'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export type CardData = {
  id: number;
  name: string;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  first_air_date: string;
  original_language: string;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#222">
    <animate
      attributeName="fill"
      values="#222;#111;#222"
      dur="2s"
      repeatCount="indefinite"
      keyTimes="0;0.5;1"
      keySplines=".42,0,.58,1; .42,0,.58,1"
      calcMode="spline"
    />
  </rect>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function Card({ data }: { data: CardData }) {  
  const [loaded, setLoaded] = useState(false);

  return (
      <Link href={`/info/${data.release_date ? 'movie' : 'tv'}/${data.id}`} className={`group flex relative rounded-lg w-full h-full transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-50"}`} prefetch={false}>
        <Image
          src={`https://image.tmdb.org/t/p/w300/${data.poster_path}`}
          alt="Poster"
          width={300}
          height={450}
          onLoad={() => setLoaded(true)}
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(600, 475))}`}
          className="rounded-lg group-hover:scale-105 transition-all"
        />
        <div className="group-hover:opacity-100 group-hover:scale-105 absolute bottom-0 w-full h-full flex flex-col justify-end text-center font-semibold rounded-md bg-gradient-to-t from-black shadow-inner shadow-black/60 opacity-0 transition-all max-2xl:opacity-100">
          <p className="text-lg font-bold line-clamp-2">{data.title ? data.title : data.name}</p>
          <div className="flex justify-center font-normal text-sm gap-[2px] mb-[10px] text-gray-300">
            <p>{data.first_air_date ? 'TV' : 'Movie' }</p>
            <p>&#x2022;</p>
            <p>{(data.release_date?.trim() || data.first_air_date?.trim() || '').slice(0, 4)}</p>
            <p>&#x2022;</p>
            <p>{(data.original_language || '').toUpperCase()}</p>
          </div>
          <div className='flex items-center px-1 gap-1 absolute bg-black/50 rounded-s-md top-2 right-0'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width='16px' height='16px'>
              <path fill='#efb100' d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            <p className='font-normal'>{data.vote_average?.toFixed(1) || '0.0'}</p>
          </div>
        </div>
        <div className="absolute w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width='40px' height='40px'>
            <path fill="#ffffff" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
          </svg>
        </div>
      </Link>
  );
}