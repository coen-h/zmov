'use client';

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WatchCard from './components/WatchCard';
import Card from './components/Card';

export default function Home() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <Header />
      <div className='flex flex-col min-h-screen bg-[radial-gradient(circle_at_top,_#382222_0%,_transparent_70%)] pt-12 mx-12'>
        <h1 className='text-5xl text-center font-semibold my-6'>Welcome Back!</h1>
        <div className="w-full flex flex-col gap-4 bg-white/10 rounded-lg p-2">
          <div className='flex justify-between'>
            <div>
              <button onClick={() => setIsActive(false)} className={`${!isActive ? 'bg-red-500/50 hover:bg-red-500/40' : 'bg-neutral-50/20 hover:bg-neutral-50/10'} transition-all px-3 py-1 text-[1.1rem] rounded-l-lg cursor-pointer`}>Continue Watching</button>
              <button onClick={() => setIsActive(true)} className={`${isActive ? 'bg-red-500/50 hover:bg-red-500/40' : 'bg-neutral-50/20 hover:bg-neutral-50/10'} transition-all px-3 py-1 text-[1.1rem] rounded-r-lg cursor-pointer`}>Watchlist</button>
            </div>
            <button className="bg-neutral-50/20 hover:bg-neutral-50/10 px-4 py-1 text-[1.1rem] rounded-lg cursor-pointer">Clear</button>
          </div>
          { isActive ? (
          <div className='grid grid-cols-4 gap-4 px-2'>
            <WatchCard />
            {/* <ServiceCard /> */}
            <Card />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
            <img src='/images/max.svg' />
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-4 px-2'>
            <WatchCard />
            <img src='/images/netflix.svg' />
            <img src='/images/netflix.svg' />
            <img src='/images/netflix.svg' />
            <img src='/images/netflix.svg' />
            <img src='/images/netflix.svg' />
            <img src='/images/netflix.svg' />
          </div>
        )}
        </div>
        
      </div>
      <Footer />
    </>
  );
}