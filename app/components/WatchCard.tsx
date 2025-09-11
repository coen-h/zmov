'use client';

import Link from "next/link";
import Image from "next/image";

export type WatchCardData = {
  poster: string;
  title: string;
  duration: number;
  progress: number;
  type: 'movie' | 'tv';
  itemId: number;
  season?: number;
  episode?: number;
};

type WatchCardProps = {
  data: WatchCardData;
  onRemove: () => void;
};

export default function WatchCard({ data, onRemove }: WatchCardProps) {
  return (
    <Link href={`/watch/${data.type}/${data.itemId}${data.type === 'tv' ? `/${data.season}/${data.episode}` : ''}`} className="relative group overflow-hidden rounded-lg border border-white/10" prefetch={false}>
      <Image
        src={data.poster}
        alt="Poster"
        width={500}
        height={281}
        className="w-full h-full rounded-md group-hover:scale-105 transition-all"
        unoptimized
      />
      <div className="absolute w-full h-full bottom-0 left-0 bg-gradient-to-t from-black">
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }} className='absolute top-2 left-2 p-2 bg-white/90 rounded-lg cursor-pointer transition-all text-black hover:bg-red-500 opacity-0 group-hover:opacity-100 max-2xl:opacity-100'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
        <div className='flex flex-col w-full justify-between absolute bottom-3 left-0 p-2'>
          {data.type === 'tv' ? ( 
            <div className='font-light text-sm'>Watching S{data.season} Episode-{data.episode}</div>
          ) : ( '' )}
          <div className="flex justify-between w-full">
            <p className='font-medium'>{data.title}</p>
            <p>{Math.floor((data.duration - data.progress) / 3600)}h {Math.floor(((data.duration - data.progress) % 3600) / 60)}m left</p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full p-2">
          <div className="bg-neutral-500/20 rounded-md w-full h-2">
            <div className='h-full bg-red-900 rounded-md' style={{ width: `${(data.progress / data.duration) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </Link>
  );
}