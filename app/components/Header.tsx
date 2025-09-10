'use client';

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user)
      } else {
        setUser(null)
      }
    })
    
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
    const query = searchRef.current?.value.trim();
    if (query) {
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

  const MIN_LOGO_WIDTH = 450;

  return (
    <div className="flex backdrop-blur-xs fixed h-20 max-lg:h-16 w-full bg-gradient-to-b from-gray-950 justify-between max-xs:justify-center items-center px-12 max-2xl:px-5 max-lg:px-3 z-50">
      <Link href='/' className="mr-1 transition-all hover:opacity-50" aria-label="Home">
      {windowWidth < MIN_LOGO_WIDTH ? (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="46px" height="46px" viewBox="0 0 177.000000 177.000000" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" fill="#e80000" stroke="none">
            <path d="M260 1430 l0 -140 359 -2 359 -3 -369 -490 -369 -490 0 -52 0 -53 605 0 605 0 0 140 0 140 -355 0 c-195 0 -355 2 -355 5 0 3 157 222 350 486 l350 482 0 58 0 59 -590 0 -590 0 0 -140z"/>
          </g>
        </svg>
      ) : (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="112.45px" height="32px" viewBox="0 0 622.000000 177.000000" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" fill="#e80000" stroke="none">
            <path d="M4012 1590 c-165 -30 -316 -127 -408 -264 -93 -136 -136 -340 -114 -538 34 -307 193 -514 450 -584 90 -25 300 -25 389 0 226 62 380 232 437 481 25 109 25 311 0 420 -54 241 -211 413 -431 470 -74 19 -251 27 -323 15z m277 -286 c122 -66 179 -220 168 -449 -9 -181 -61 -302 -158 -367 -118 -79 -286 -61 -381 40 -53 56 -82 128 -97 236 -40 287 49 508 229 567 14 5 61 7 105 6 67 -3 89 -8 134 -33z"/>
            <path d="M2004 1575 c-75 -16 -133 -45 -183 -90 -21 -19 -41 -35 -44 -35 -3 0 -19 25 -36 55 l-31 55 -110 0 -110 0 0 -680 0 -680 160 0 160 0 0 497 0 496 41 39 c61 59 127 88 197 88 107 0 171 -35 208 -114 l24 -51 0 -477 0 -478 155 0 155 0 0 488 c0 550 -4 520 80 581 59 42 101 54 184 49 97 -4 147 -36 184 -116 l27 -57 3 -472 3 -473 155 0 154 0 0 493 c0 533 -3 564 -56 668 -88 175 -308 262 -539 214 -81 -17 -200 -72 -234 -109 l-24 -25 -42 34 c-114 94 -316 136 -481 100z"/>
            <path d="M4703 1578 c8 -20 583 -1319 598 -1350 11 -26 17 -28 68 -28 l56 0 310 686 c171 377 312 689 313 695 3 6 -58 8 -163 7 l-168 -3 -169 -405 c-93 -223 -173 -408 -176 -412 -4 -3 -79 179 -167 405 l-160 412 -174 3 c-137 2 -172 0 -168 -10z"/>
            <path d="M260 1430 l0 -140 359 -2 359 -3 -369 -490 -369 -490 0 -52 0 -53 605 0 605 0 0 140 0 140 -355 0 c-195 0 -355 2 -355 5 0 3 157 222 350 486 l350 482 0 58 0 59 -590 0 -590 0 0 -140z"/>
          </g>
        </svg>
      )}
      </Link>
      <div className="flex items-center gap-2">
        <div className="flex items-center relative hover:opacity-80 transition-all">
          <button aria-label="Search" onClick={handleSearch} className="w-10 h-full absolute left-0 top-1/2 -translate-y-1/2 bg-white/5 p-2 rounded-l-xl hover:bg-white/15 transition-all cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={24} height={24}>
              <path fill="#ffffff" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
          </button>
          <input className="pl-12 py-2 bg-white/15 rounded-xl outline-0 outline-white/30 focus:outline-1 line-clamp-1 max-xs:w-[280px] max-xss:w-[224px]" placeholder="Type to search..." ref={searchRef} onKeyDown={(e) => { if (e.key === 'Enter') {handleSearch();} }} />
        </div>
        <Link href='/user' className="bg-white/15 rounded-xl transition-all hover:scale-95" aria-label="Profile">
          {user ? (
            <Image 
              width={40}
              height={40}
              src={user.user_metadata?.avatar_url ?? ''}
              alt="Profile"
              className="rounded-xl"
              referrerPolicy="no-referrer"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={32} height={32} className="m-1">
              <path fill="#ffffff" d="M406.5 399.6C387.4 352.9 341.5 320 288 320l-64 0c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3l64 0c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z"/>
            </svg>
          )}
          
        </Link>
      </div>
    </div>
  );
}