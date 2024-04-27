/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';

import CollectionT from '@/types/Collection';

import Card from './Card';

export default function Collection({ title, items }: CollectionT) {
  const card = useRef<HTMLAnchorElement>(null);

  const [cardWidth, setCardWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [indexMax, setIndexMax] = useState(0);

  function onBack() {
    if (index <= 0) return;

    setIndex(index - 1);
  }

  function onNext() {
    if (index >= indexMax) return;

    setIndex(index + 1);
  }

  function onResize() {
    if (!card.current) return;

    const el = card.current;

    const cardWidth = el.clientWidth + 15;

    const sliderWidth = window.innerWidth - 120;

    const cardsCount = items.length;
    const cardsVisible = Math.floor(sliderWidth / cardWidth);

    const indexMax = cardsCount - cardsVisible;

    setCardWidth(cardWidth);

    if (indexMax < 0) return;

    setIndexMax(indexMax - 1);
  }

  useEffect(() => {
    if (!card.current) return;

    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [card]);

  return (
    <div className="collection">
      <h2 className="collection-title">{title}</h2>

      <div className="collection-slider">
        <div
          className="collection-cards"
          style={{
            transform: `translateX(-${index * cardWidth}px)`
          }}
        >
          {items.map((item, i) => {
            return <Card key={i} Ref={i === 0 ? card : undefined} {...item} />;
          })}
        </div>

        {index > 0 && (
          <div className="collection-arrow" onClick={onBack}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>
        )}

        {index < indexMax && (
          <div className="collection-arrow right" onClick={onNext}>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        )}
      </div>
    </div>
  );
}
