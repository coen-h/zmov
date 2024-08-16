import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dmca from './pages/Dmca';
import Info from './pages/Info';
import Player from './pages/Player'
import Settings from './pages/Settings';
import Search from './pages/Search'
import Services from './pages/Services'
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dmca" element={<Dmca />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/info/:type/:id" element={<Info />} />
        <Route path="/watch/:type/:id/*" element={<Player />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/service/:service" element={<Services />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}