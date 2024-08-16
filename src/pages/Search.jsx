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
            <div id="search-section">
                <p id="search-title">Search Results:</p>
                <p id="search-query">&quot;{query}&quot;</p>
                <div id="search-results">
                    {items.map(item => (
                        <Card key={item.id} csize="big-card" size="big-image" item={item} type={item.media_type} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}