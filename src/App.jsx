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
        <Discover />
        <Discover />
        <Discover />
        <Discover />
      </div>
      <Footer />
    </>
  )
}