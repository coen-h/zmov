import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dmca from './pages/Dmca';
import Info from './pages/Info';
import Player from './pages/Player'
import Settings from './pages/Settings';
import Search from './pages/Search'
import ScrollToTopOnLoad from './utils/ScrollToTopOnLoad';
import Services from './pages/Services'

export default function App() {
  return (
    <Router>
      <ScrollToTopOnLoad />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dmca" element={<Dmca />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/info/:type/:id" element={<Info />} />
        <Route path="/player/:type/:id/:season/:episode" element={<Player />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/service/:service" element={<Services />} />
      </Routes>
    </Router>
  );
}