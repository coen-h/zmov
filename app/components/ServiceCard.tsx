'use client';

import Link from "next/link";

export default function ServiceCard() {
  return (
    <Link href='/service' className="w-full p-8 shadow-inner shadow-gray-700 rounded-xl bg-gradient-to-b from-black to-blue-600/80">
      <img className="h-full" src='/images/disney.svg' alt="Service Image"/>
    </Link>
    // <Link href='/service' className="w-full p-8 shadow-inner shadow-gray-700 rounded-xl bg-gradient-to-tl from-red-700/80 via-black to-red-700/80">
    //   <img className="h-full" src='/images/netflix.svg' alt="Service Image"/>
    // </Link>
    // <Link href='/service' className="w-full p-8 shadow-inner shadow-gray-700 rounded-xl bg-gradient-to-r from-white/80 to-purple-400/80">
    //   <img className="h-full" src='/images/max.svg' alt="Service Image"/>
    // </Link>
    // <Link href='/service' className="w-full p-8 shadow-inner shadow-gray-700 rounded-xl bg-gray-400/85">
    //   <img className="h-full" src='/images/apple.svg' alt="Service Image"/>
    // </Link>
    // <Link href='/service' className="w-full p-8 shadow-inner shadow-gray-700 rounded-xl bg-white/80">
    //   <img className="h-full" src='/images/prime.svg' alt="Service Image"/>
    // </Link>
  );
}