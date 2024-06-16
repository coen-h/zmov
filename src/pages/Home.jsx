import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Discover from '../components/Discover'
import ServiceCard from '../components/ServiceCard'
import '../style.css'

export default function App() {

  const apiKey = import.meta.env.VITE_API_KEY;
  
  return (
    <>
      <Header />
      <Hero />
      <div id="home">
        <div id='service'>
          <ServiceCard img="/netflix.svg" type="netflix" />
          <ServiceCard img="/disney.svg" type="disney" />
          <ServiceCard img="/apple.svg" type="apple" />
          <ServiceCard img="/prime.svg" type="prime" />
          <ServiceCard img="/max.svg" type="max" />
        </div>
        <div id='discover'>
          <Discover url={`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`} name="Trending movies this week" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`} name="Trending series this week" type="tv" />
          <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc`} name="Top rated movies" type="movie" />
          <Discover url={`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=vote_count.desc`} name="Top rated series" type="tv" />
        </div>
      </div>
      <Footer />
    </>
  )
}
