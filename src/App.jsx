import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Discover from './components/Discover'
// https://stackoverflow.com/questions/70807477/react-import-multiple-components-from-a-folder
import './style.css'

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <div id='discover'>
        <Discover url='https://api.themoviedb.org/3/trending/movie/week' name="Trending movies this week" />
        <Discover url='https://api.themoviedb.org/3/trending/tv/week' name="Trending series this week" />
        <Discover url="https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc" name="Top rated movies" />
        <Discover url="https://api.themoviedb.org/3/discover/tv?sort_by=vote_count.desc" name="Top rated series" />
        <Discover url="https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=8" name="Netflix" />
        <Discover url="https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=350" name="Apple TV+" />
        <Discover url="https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=337" name="Disney+" />
        <Discover url="https://api.themoviedb.org/3/discover/movie?watch_region=US&with_watch_providers=9" name="Amazon Prime Video" />
      </div>
      <Footer />
    </>
  )
}