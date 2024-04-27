import MediaShort from '@/types/MediaShort';
import MediaType from '@/types/MediaType';

function has(id: number, type: MediaType) {
  const storage = localStorage.getItem('wishlist');

  if (!storage) return false;

  const wishlist: MediaShort[] = JSON.parse(storage);

  return wishlist.some(e => e.id === id && e.type === type);
}

function add(media: MediaShort) {
  let wishlist: MediaShort[] = [];

  const storage = localStorage.getItem('wishlist');

  if (storage) {
    wishlist = JSON.parse(storage);
  }

  wishlist.push(media);

  localStorage.setItem('wishlist', JSON.stringify(wishlist));

  window.dispatchEvent(new CustomEvent(`wishlist-${media.type}-${media.id}`));
  window.dispatchEvent(new CustomEvent(`wishlist-changed`));
}

function remove(id: number, type: MediaType) {
  const storage = localStorage.getItem('wishlist');

  if (!storage) return;

  let wishlist: MediaShort[] = JSON.parse(storage);

  wishlist = wishlist.filter(e => e.id !== id || e.type !== type);

  localStorage.setItem('wishlist', JSON.stringify(wishlist));

  window.dispatchEvent(new CustomEvent(`wishlist-${type}-${id}`));
  window.dispatchEvent(new CustomEvent(`wishlist-changed`));
}

function on(id: number, type: string, callback: () => void) {
  window.addEventListener(`wishlist-${type}-${id}`, callback);
}

function off(id: number, type: string, callback: () => void) {
  window.removeEventListener(`wishlist-${type}-${id}`, callback);
}

export default {
  has,
  add,
  remove,
  on,
  off
};
