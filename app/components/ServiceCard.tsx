'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { serviceConfig } from '@/app/lib/serviceConfig';

type ServiceType = keyof typeof serviceConfig

export default function ServiceCard({ type }: { type: ServiceType | string }) {
  const config = serviceConfig.find(item => item.type === type);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MIN_WIDTH = 900;

  return (
    <Link
      href={`/service/${config?.id}`}
      className={`flex justify-center w-full h-[175px] px-12 py-4 shadow-inner shadow-gray-700 rounded-xl ${config?.background} max-3xl:px-4`}
    >
      <img className="h-full" src={windowWidth > MIN_WIDTH ? config?.image : config?.squareimage} alt={config?.alt} />
    </Link>
  );
}