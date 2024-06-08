import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Discover from '../components/Discover'
import '../style.css'

export default function App() {

  const apiKey = import.meta.env.VITE_API_KEY;
  
  return (
    <>
      <Header />
      <Hero />
      <div id='discover'>
        <Discover url={`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`} name="Trending movies this week" type="movie" />
        <Discover url={`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`} name="Trending series this week" type="tv" />
        <Discover url={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc`} name="Top rated movies" type="movie" />
        <Discover url={`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=vote_count.desc`} name="Top rated series" type="tv" />
        <Discover url={`https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=8&api_key=${apiKey}`} name="Netflix" type="movie" />
        <Discover url={`https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=350&api_key=${apiKey}`} name="Apple TV+" type="movie" />
        <Discover url={`https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=337&api_key=${apiKey}`} name="Disney+" type="movie" />
        <Discover url={`https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=9&api_key=${apiKey}`} name="Amazon Prime Video" type="movie" />
      </div>
      <Footer />
    </>
  )
}
