import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Card from './Card';
import PropTypes from 'prop-types';

Discover.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

SwiperCore.use([Navigation]);

export default function Discover(props) {
  const [movies, setMovies] = useState([]);
  const [slideWidth, setSlideWidth] = useState('28vw');

  const getSlideWidth = () => {
    const width = window.innerWidth;
    
    if (width >= 1400) return '12vw';
    if (width >= 1100) return '16vw';
    if (width >= 800) return '22vw';
    if (width >= 550) return '28vw';
    if (width >= 450) return '40vw';
    return '47vw';
  };

  useEffect(() => {
    setSlideWidth(getSlideWidth());

    const handleResize = () => {
      setSlideWidth(getSlideWidth());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(props.url);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.url]);

  const swiperParams = {
    slidesPerView: "auto",
    navigation: true,
    loop: movies.length > 1,
    className: "!p-3"
  };

  return (
    <div id="discover-section" className='flex flex-col my-4 mx-10 max-2xl:mx-0'>
      <p id="discover-title" className=' text-[2rem] ml-2 font-bold max-xl:ml-3 max-md:text-[7vw]'>{props.name}</p>
      <div id="discover-main" className='flex items-center'>
        <Swiper {...swiperParams}>
          {movies.map((item, index) => (
            <SwiperSlide key={index} style={{width: slideWidth, height: '100%'}} className='mr-[0.75vw] max-xl:mr-[1.5vw]'>
              <Card item={item} size="w-[12vw] max-2xl:w-[16vw] max-xl:w-[22vw] max-lg:w-[28vw] max-md:w-[40vw] max-xs:w-[47vw]" type={props.type} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}