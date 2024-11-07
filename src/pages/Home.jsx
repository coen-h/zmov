import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Discover from '../components/Discover'
import ServiceCard from '../components/ServiceCard'

export default function Home() {

  const apiKey = import.meta.env.VITE_API_KEY;
  
  useEffect(() => {
    document.title = 'Home - zmov';
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  return (
    <>
      <Header />
      <Hero />
      <div id="home" className='z-[1] relative top-[-20vh] mb-[-20vh] max-lg:top-[-40vh] max-lg:mb-[-40vh] max-2xl:top-[-25vh] max-2xl:mb-[-25vh] [@media(max-height:500px)]:top-[-34vh] [@media(max-height:500px)]:mb-[-34vh] bg-hero-gradient'>
        <div id='service' className='flex justify-center gap-[1vw] mx-8 mt-12 mb-8'>
          <ServiceCard img="/images/netflix.svg" type="netflix" style={{backgroundImage: "linear-gradient(to top left, rgb(152, 0, 0), black,  black,  black, rgb(152, 0, 0))"}} />
          <ServiceCard img="/images/disney.svg"  type="disney" style={{backgroundImage: "linear-gradient(to bottom, rgb(0, 0, 0), rgba(0, 58, 183, 0.8))"}} />
          <ServiceCard img="/images/apple.svg" type="apple"style={{backgroundColor: "rgba(165, 165, 165, 0.8)"}} />
          <ServiceCard img="/images/prime.svg" type="prime" style={{backgroundColor: "rgba(255, 255, 255, 0.8)"}} />
          <ServiceCard img="/images/max.svg" type="max" style={{backgroundImage: "linear-gradient(to right, rgba(239, 240, 255, 0.8), rgba(187, 166, 255, 0.8))"}} />
        </div>
        <div id='discover' className='flex flex-col z-[2]'>
          <Discover url={`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&include_adult=false`} name="Trending movies this week" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&include_adult=false`} name="Trending series this week" type="tv" />
          <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc&include_adult=false`} name="Top rated movies" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=vote_count.desc&include_adult=false`} name="Top rated series" type="tv" />
          <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=10751&include_adult=false`} name="Family" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=80&include_adult=false`} name="Crime" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&include_adult=false`} name="Horror" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=99&include_adult=false`} name="Documentary" type="movie" />
        </div>
      </div>
      <Footer />
    </>
  )
}
