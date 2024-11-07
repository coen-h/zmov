import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import LoadingBar from 'react-top-loading-bar';

export default function Search() {
    const { query } = useParams();
    const [items, setItems] = useState([]);
    const loadingBarRef = useRef(null);
    
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fetchData = async () => {
            document.title = `${query} - zmov`;
            if (loadingBarRef.current) loadingBarRef.current.continuousStart();
            try {
                const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${apiKey}&include_adult=false`);
                const data = await response.json();
                const filteredData = data.results.filter(item => item.media_type !== 'person');
                setItems(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                if (loadingBarRef.current) loadingBarRef.current.complete();
            }
        };

        fetchData();
    }, [query, apiKey]);

    return (
        <>  
            <LoadingBar color="#FF0000" ref={loadingBarRef} />
            <Header />
            <div className='min-h-screen my-0 mx-[18vw] pt-28 max-xl:mx-[10vw] max-lg:mx-[4vw] max-lg:pt-20 max-md:mx-[3vw]'>
                <p className='text-2xl'>Search Results:</p>
                <p className='text-[2rem] font-bold mb-6'>&quot;{query}&quot;</p>
                <div className='flex justify-center flex-wrap gap-[1.2vw] max-md:gap-[2vw]'>
                    {items.map(item => (
                        <Card key={item.id} size="w-[20.4vw] max-xl:w-[25.7vw] max-lg:w-[29.7vw] max-md:w-[45.8vw]" item={item} type={item.media_type} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}