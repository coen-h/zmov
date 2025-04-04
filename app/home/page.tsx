'use client';

import Link from "next/link";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
        <div className='relative w-screen h-[80vh]'>
          <div className='absolute bottom-0 left-0'>
            <div className='flex gap-2'>
              <p>S</p><p>6.2</p>
              <p>C</p><p>2024-10-31</p>
              <p>LV</p>
            </div>
            <p>Severance</p>
            <p>Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched in every way, Team Sonic must seek out an unlikely alliance in hopes of stopping Shadow and protecting the planet.</p>
            <div className="flex gap-2">
              <Link href='/watch' className='gap-2 px-4 py-2 bg-white rounded-lg text-xl font-bold transition-all text-black hover:bg-white/50'>
                <p>Watch</p>
              </Link>
              <Link href='/watch' className='gap-2 px-4 py-2 bg-white/20 rounded-lg text-xl font-bold transition-all hover:bg-white/10'>
                <p>Info</p>
              </Link>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
}