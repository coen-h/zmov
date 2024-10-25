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
      <div id="settings-main" className='flex flex-col bg-white bg-opacity-10 rounded-xl mx-20 px-2 pb-2'>
        <div id="watchlist-title" className='flex justify-between items-center order-[-1] mt-2 mb-4 gap-8'>
          <div id="settings-button-grid" className='flex justify-between w-screen'>
            <div>
              <button
                id="settings-button"
                className={`border-0 cursor-pointer text-[1.05rem] p-[0.4rem] rounded-s-lg bg-${activeButton === 'continueWatching' ? 'red-900' : 'neutral-800'}`}
                onClick={() => handleButtonClick('continueWatching')}
              >
                Continue Watching
              </button>
              <button
                id="settings-button"
                className={`border-0 cursor-pointer text-[1.05rem] p-[0.4rem] rounded-e-lg bg-${activeButton === 'watchlist' ? 'red-900' : 'neutral-800'}`}
                onClick={() => handleButtonClick('watchlist')}
              >
                Watchlist
              </button>
            </div>
            <div>
              {activeButton === 'watchlist' && (
                <button id="watchlist-clear" className="w-[70px] h-[35px] rounded-lg text-[1.05rem] border-0 bg-white bg-opacity-20 cursor-pointer hover:bg-opacity-10 active:scale-95" onClick={clearWatchlist}>Clear</button>
              )}
              {activeButton === 'continueWatching' && (
                <button id="watchlist-clear" className="w-[70px] h-[35px] rounded-lg text-[1.05rem] border-0 bg-white bg-opacity-20 cursor-pointer hover:bg-opacity-10 active:scale-95" onClick={clearContinueWatching}>Clear</button>
              )}
            </div>
          </div>
        </div>
        <div id="watchlist-card" className='flex justify-center flex-wrap gap-3'>
          {activeButton === 'watchlist' && (
            watchlist.length > 0 ? (
              watchlist.map((item, index) => (
                <div key={index}>
                  <WatchlistCard item={item.item} type={item.type} onRemove={removeWatchlistItem} />
                </div>
              ))
            ) : (
              <p id="watchlist-message" className='flex items-center justify-center text-center p-[5vw]'>Your Watchlist is Empty!</p>
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