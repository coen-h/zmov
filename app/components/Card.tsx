'use client';

import Link from "next/link";

export default function Card() {
  return (
    <Link href='/info' className='flex relative h-full rounded-lg'>
      <img
        className='object-cover rounded-lg'
        alt="Poster"
      />
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <p className="text-white text-[2.5rem]">Play Icon</p>
      </div>
        <div className="absolute top-0 left-0 w-full h-full text-center font-semibold bg-gradient-to-t from-black rounded-md shadow-inner">
          <p className="text-lg font-bold line-clamp-2">Severance</p>
          <div className="flex justify-center font-normal text-sm gap-[2px] mb-[10px] text-gray-300">
            <p>TV</p>
            <p>&#x2022;</p>
            <p>2023</p>
            <p>&#x2022;</p>
            <p>JP</p>
          </div>
          <div className='flex gap-1 absolute bg-black/50 rounded-s-md top-2 right-0'>
            <p className="text-yellow-500">S</p>
            <p className='font-normal'>9.7</p>
        </div>
      </div>
    </Link>
  );
}