import { useState, useEffect } from 'react';
import WatchlistCard from './WatchlistCard';
import WideCard from './WideCard';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [activeButton, setActiveButton] = useState('continueWatching');

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(storedWatchlist);

    const storedContinueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
    setContinueWatching(storedContinueWatching);
  }, []);

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const removeWatchlistItem = (id) => {
    const updatedWatchlist = watchlist.filter(item => item.item.id !== id);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const removeContinueWatchingItem = (id) => {
    const updatedContinueWatching = continueWatching.filter(item => item.id !== id);
    setContinueWatching(updatedContinueWatching);
    localStorage.setItem('continueWatching', JSON.stringify(updatedContinueWatching));
  };

  const clearWatchlist = () => {
    localStorage.removeItem('watchlist');
    setWatchlist([]);
  };

  const clearContinueWatching = () => {
    localStorage.removeItem('continueWatching');
    setContinueWatching([]);
  };

  return (
    <>
      <div id="settings-main">
        <div style={{ marginBottom: '0.2rem' }} id="watchlist-title">
          <div id="settings-button-grid">
            <div>
              <button
                id="settings-button"
                style={{ borderRadius: "8px 0 0 8px", backgroundColor: activeButton === 'continueWatching' ? 'rgba(255, 70, 70, 0.5)' : 'rgba(255,255,255,0.2)' }}
                onClick={() => handleButtonClick('continueWatching')}
              >
                Continue Watching
              </button>
              <button
                id="settings-button"
                style={{ borderRadius: "0 8px 8px 0", backgroundColor: activeButton === 'watchlist' ? 'rgba(255, 70, 70, 0.5)' : 'rgba(255,255,255,0.2)' }}
                onClick={() => handleButtonClick('watchlist')}
              >
                Watchlist
              </button>
            </div>
            <div>
              {activeButton === 'watchlist' && (
                <button id="watchlist-clear" onClick={clearWatchlist}>Clear</button>
              )}
              {activeButton === 'continueWatching' && (
                <button id="watchlist-clear" onClick={clearContinueWatching}>Clear</button>
              )}
            </div>
          </div>
        </div>
        <div id="watchlist-card">
          {activeButton === 'watchlist' && (
            watchlist.length > 0 ? (
              watchlist.map((item, index) => (
                <div key={index}>
                  <WatchlistCard item={item.item} type={item.type} onRemove={removeWatchlistItem} />
                </div>
              ))
            ) : (
              <p id="watchlist-message">Your Watchlist is Empty!</p>
            )
          )}
          {activeButton === 'continueWatching' && (
            continueWatching.length > 0 ? (
              continueWatching.map((item, index) => (
                <div key={index}>
                  <WideCard item={item} onRemove={removeContinueWatchingItem} />
                </div>
              ))
            ) : (
              <p id="watchlist-message">You Haven&apos;t Watched Anything Yet!</p>
            )
          )}
        </div>
      </div>
    </>
  );
}