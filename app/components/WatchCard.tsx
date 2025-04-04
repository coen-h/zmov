'use client';

import Link from "next/link";

export default function WatchCard() {
  return (
    <Link href='/info' className="relative">
      <img className="h-full object-cover transition-all rounded-lg" alt="Backdrop" />
      <div className="absolute w-full h-full bottom-0 left-0 bg-gradient-to-t from-black rounded-lg">
        <button className='absolute top-2 right-2 p-2 bg-white/90 rounded-lg cursor-pointer transition-all text-black hover:bg-red-500'>
          <p>Bin</p>
        </button>
        <div className='absolute bottom-0 left-0 p-2'>
          <div className='font-light text-sm'>Watching S2 Episode-1</div>
          <p className='font-medium'>Severance</p>
        </div>
        <button className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-lg cursor-pointer transition-all text-black hover:bg-red-500">
          <p>Play</p>
        </button>
      </div>
    </Link>
  );
}