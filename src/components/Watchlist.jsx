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
      <div id="settings-main" className='flex flex-col bg-white bg-opacity-10 rounded-xl mx-[5vw] max-md:mx-[2vw] px-[0.5vw] max-xl:px-[1vw] max-md:px-[1.5vw] pb-2'>
        <div id="watchlist-title" className='flex justify-between items-center order-[-1] mt-2 mb-4 gap-8'>
          <div id="settings-button-grid" className='flex justify-between w-screen'>
            <div>
              <button
                id="settings-button"
                className={`min-w-16 min-h-[33px] border-none cursor-pointer text-[1.05rem] py-1 px-2 rounded-s-lg bg-opacity-90 ${activeButton === 'continueWatching' ? 'bg-[#b12222]' : 'bg-neutral-600'}`}
                onClick={() => handleButtonClick('continueWatching')}
              >
                <span className="max-xs:hidden">Continue Watching</span>
              </button>
              <button
                id="settings-button"
                className={`min-w-16 min-h-[33px] border-none cursor-pointer text-[1.05rem] py-1 px-2 rounded-e-lg bg-opacity-90 ${activeButton === 'watchlist' ? 'bg-[#b12222]' : 'bg-neutral-600'}`}
                onClick={() => handleButtonClick('watchlist')}
              >
                <span className="max-xs:hidden">Watchlist</span>
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
        <div id="watchlist-card" className='flex justify-center flex-wrap gap-[0.7vw] max-xl:gap-[1.25vw]'>
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