'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full flex justify-between px-12 py-4 bg-gradient-to-t from-[#1a0b0b]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1"><p className="font-semibold text-lg">Welcome to</p><img src='/logo.png' alt="logo" className="h-7 hover:opacity-50 transition-all" /></div>
        <p className="font-light">This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p>
        <p>Copyright © zmov {new Date().getFullYear()}</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href='/dmca' className="font-semibold text-white/50 hover:text-white">DMCA</Link>
        <Link href='https://github.com/coen-h' rel="noopener noreferrer" target="_blank"><img src="/icon.png" alt="icon" className="h-10 opacity-50 hover:opacity-100 transition-all" /></Link>
      </div>
    </div>
  );
}