'use client';

import Link from "next/link";

export default function Header() {
  return (
    <div className="flex fixed h-20 w-full bg-gradient-to-b from-gray-950 justify-between items-center px-12">
      <Link href='/'>
        <img src="/logo.png" alt="logo" className="h-8 hover:opacity-50 transition-all" />
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center relative hover:opacity-80 transition-all">
          <img className="absolute h-8 left-1" src='/icon.png' />
          <input className="pl-10 py-2 bg-white/15 rounded-xl text-lg outline-0 outline-white/50 focus:outline-2" placeholder="Type to search..." />
        </div>
        <Link href='/home' className="bg-white/15 p-[6px] transition-all hover:scale-95 hover:rotate-45 rounded-full"><img src="/icon.png" alt="icon" className="h-8"/></Link>
      </div>
    </div>
  );
}