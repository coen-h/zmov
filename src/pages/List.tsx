import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import MediaShort from '@/types/MediaShort';
import Card from '@/components/Card';

export default function List() {
  const [wishlist, setWishlist] = useState<MediaShort[]>([]);

  function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');

    if (!wishlist) return;

    setWishlist(JSON.parse(wishlist));
  }

  useEffect(() => {
    getWishlist();

    window.addEventListener('wishlist-changed', getWishlist);

    return () => {
      window.removeEventListener('wishlist-changed', getWishlist);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Watchlist - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="page">
        <h1 className="page-title">Watchlist</h1>

        <div className="page-cards">
          {wishlist.map(media => (
            <Card key={media.id + media.type} {...media} />
          ))}
        </div>
      </div>
    </>
  );
}
