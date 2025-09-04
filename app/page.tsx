"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import fetchHome from "@/app/lib/fetchHome";
import fetchHero from "@/app/lib/fetchHero";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Card, { CardData } from "@/app/components/Card";
import ServiceCard from "@/app/components/ServiceCard";
import Link from "next/link";
import { serviceConfig } from "@/app/lib/serviceConfig";

interface HomeData {
  title: string;
  data: CardData[];
}

interface HeroData {
  id: number;
  backdrop_path: string;
  trailerKey: string;
  logo: string;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData[]>([]);
  const [heroData, setHeroData] = useState<HeroData[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const result = await fetchHome();
      const hero = await fetchHero();

      setHomeData(result);
      setHeroData(hero);
    }
    fetchData();
  }, []);

  const heroSwiperParams = {
    loop: true,
  };

  const serviceSwiperParams = {
    slidesPerView: 4,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    modules: [Autoplay],
    loop: true,
    spaceBetween: 16,
    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      550: {
        slidesPerView: 3,
      },
      700: {
        slidesPerView: 4,
      },
      900: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1700: {
        slidesPerView: 5,
      },
    },
  };

  const cardSwiperParams = {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 6,
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 8,
      },
      450: {
        spaceBetween: 12,
      },
      600: {
        slidesPerView: 3,
      },
      900: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      },
      1400: {
        slidesPerView: 6,
      },
      1800: {
        slidesPerView: 7,
      },
      2200: {
        slidesPerView: 8,
      },
    },
  };

  const MIN_IFRAME_WIDTH = 1200;

  return (
    <>
      <Header />
      {heroData[0] ? (
      <>
      <Swiper {...heroSwiperParams}>
        {heroData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex h-screen">
              <div
                className={`absolute w-screen h-screen overflow-hidden z-[-1] opacity-40`}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1920/${item.backdrop_path})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                {windowWidth > MIN_IFRAME_WIDTH && (
                  <iframe
                    src={`https://www.youtube.com/embed/${item.trailerKey}?mute=1&autoplay=1&loop=1&rel=0&fs=0&controls=0&disablekb=1&playlist=${item.trailerKey}&origin=https://watch.coen.ovh`}
                    title={item.title}
                    allowFullScreen
                    className={`absolute w-[150vw] h-[200vh] top-[-50%] left-[-25%] object-cover border-none transition-opacity duration-500 ease-in opacity-100`}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex flex-col justify-end mb-52 ml-12 gap-1 max-2xl:ml-5 max-lg:items-center max-lg:w-full max-lg:mx-5">
                <div className="flex font-semibold mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${item.logo}`}
                    className="max-w-[60vw] max-h-[30vh] max-lg:max-w-[85vw] text-5xl text-center"
                    alt={item.title}
                  />
                </div>
                <div className="flex gap-[10px]">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="size-4"
                    >
                      <path
                        fill="#efb100"
                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                      />
                    </svg>
                    <p>{item.vote_average.toFixed(1)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="size-4"
                    >
                      <path
                        fill="#ffffff"
                        d="M112 0c8.8 0 16 7.2 16 16V64H320V16c0-8.8 7.2-16 16-16s16 7.2 16 16V64h32c35.3 0 64 28.7 64 64v32 32V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 160 128C0 92.7 28.7 64 64 64H96V16c0-8.8 7.2-16 16-16zM416 192H32V448c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V192zM384 96H64c-17.7 0-32 14.3-32 32v32H416V128c0-17.7-14.3-32-32-32zM96 368c0-8.8 7.2-16 16-16H240c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zm16-112H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                      />
                    </svg>
                    <p>{item.release_date}</p>
                  </div>
                  <p className="py-[1px] px-[4px] outline outline-gray-400 rounded-md">
                    {"en".toUpperCase()}
                  </p>
                </div>
                <p className="text-[1.05rem] w-[40vw] leading-6 line-clamp-3 max-lg:w-full">
                  {item.overview}
                </p>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/watch/movie/${item.id}`}
                    className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg text-xl font-bold border-none transition-all hover:bg-white/50 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className="size-5"
                    >
                      <path
                        fill="#000000"
                        d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                      />
                    </svg>
                    <p className="text-black">Watch</p>
                  </Link>
                  <Link
                    href={`/info/movie/${item.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-xl font-bold border-none transition-all hover:bg-white/10"
                    prefetch={false}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="size-5"
                    >
                      <path
                        fill="#ffffff"
                        d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8V248c0-13.3-10.7-24-24-24H216c-13.3 0-24 10.7-24 24s10.7 24 24 24h24v64H216zm40-144a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                      />
                    </svg>
                    <p>Info</p>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute z-10 bottom-[-2%] w-full bg-gradient-to-b to-black to-90% py-4 px-12 max-2xl:px-5 max-lg:px-3">
        <Swiper {...serviceSwiperParams}>
          {serviceConfig.map((item, index) => (
            <SwiperSlide key={index}>
              <ServiceCard type={item.type} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {homeData.map((section, index) => (
        <div
          key={index}
          className="flex flex-col mt-10 mx-10 max-2xl:mx-2 max-lg:mx-0 max-lg:mt-4"
        >
          <p className="text-[2rem] ml-2 font-bold">{section.title}</p>
          <div className="flex items-center">
            <Swiper {...cardSwiperParams} style={{ padding: "12px" }}>
              {section.data &&
                section?.data?.map((cardData: CardData) => (
                  <SwiperSlide key={cardData.id}>
                    <Card data={cardData} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      ))}
      </>
      ) : (
        <div className='flex justify-center items-center w-screen h-screen text-center'>
          <svg stroke="#ff3838" width='60' height='60' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>
        </div>
      )}
      <Footer />
    </>
  );
}
