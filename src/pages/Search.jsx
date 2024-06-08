import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { useParams } from 'react-router-dom';

export default function Search() {
    const { query } = useParams();
    const [items, setItems] = useState([]);
    
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${apiKey}`);
                const data = await response.json();
                const filteredData = data.results.filter(item => item.media_type !== 'person');
                setItems(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [query]);

    return (
        <>  
            <Header />
            <div id="search-section">
                <div id="search-results">
                    {items.map(item => (
                        <Card key={item.id} size="big-image" item={item} type={item.media_type} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}