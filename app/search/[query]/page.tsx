'use client';

import { useEffect, useState, useMemo } from "react";
// import { useRouter, useParams } from "next/navigation";
import { useParams } from "next/navigation";
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Card, { CardData } from '@/app/components/Card';
import fetchSearch from '@/app/lib/fetchSearch';

type SearchResult = CardData & {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
}

interface SearchResponse {
  results: SearchResult[];
}

export default function Search() {
  // const router = useRouter();
  const { query } = useParams<{ query?: string }>();
  const [type, setType] = useState('multi');
  // const [inputValue, setInputValue] = useState(decodeURIComponent(query ?? ""));
  // const [searchTerm, setSearchTerm] = useState(decodeURIComponent(query ?? ""));
  const searchTerm = decodeURIComponent(query ?? "");
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);

  useEffect(() => {
    if (!searchTerm) {
      setSearchData(null);
      return;
    }
    
    document.title = `${decodeURIComponent(query ?? "")} - zmov`;
    
    async function fetchData() {
      setSearchData(null);
      const result = await fetchSearch(searchTerm, type);
      setSearchData(result);
    }

    fetchData();
  }, [searchTerm]);

  const filteredResults = useMemo(() => {
    if (!searchData?.results) return [];

    if (type === 'multi') return searchData.results;

    return searchData.results.filter(item => {
      if (type === 'movie') return item.title;
      if (type === 'tv') return item.name;
      return true;
    });
  }, [searchData, type]);

  // function handleInputChange(e: { target: { value: string } }) {
  //   setInputValue(e.target.value);
  // }

  // function handleKeyDown(e: { key: string }) {
  //   if (e.key === 'Enter') {
  //     router.push(`/search/${inputValue}`);
  //     setSearchTerm(inputValue);
  //   }
  // }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center pt-24 max-lg:pt-[70px] max-2xl:pt-[84px] mx-5 max-lg:mx-3 min-h-screen">

        <div className="w-full max-w-[1200px] mb-2">
          {/* <input
            className="w-full py-2 px-2 bg-white/15 rounded-xl outline-0 outline-white/50 focus:outline-1"
            value={inputValue}
            placeholder="Type to search..."
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          /> */}
          <p className='text-2xl'>Search Results:</p>
          <p className='text-[2rem] font-bold mb-2'>&quot;{searchTerm}&quot;</p>
        </div>

        <div className="w-full max-w-[1200px] mb-4 p-1 rounded-lg grid grid-cols-3 gap-1 bg-white/10">
          <button onClick={() => setType('multi')} className={`text-center bg-white rounded-lg py-2 text-sm font-semibold cursor-pointer ${type === 'multi' ? 'bg-white/15 text-white hover:bg-white/20' : 'bg-white/50 text-black hover:bg-white/40'}`}>
            ALL
          </button>
          <button onClick={() => setType('movie')} className={`text-center bg-white rounded-lg py-2 text-sm font-semibold cursor-pointer ${type === 'movie' ? 'bg-white/15 text-white hover:bg-white/20' : 'bg-white/50 text-black hover:bg-white/40'}`}>
            MOVIE
          </button>
          <button onClick={() => setType('tv')} className={`text-center bg-white rounded-lg py-2 text-sm font-semibold cursor-pointer ${type === 'tv' ? 'bg-white/15 text-white hover:bg-white/20' : 'bg-white/50 text-black hover:bg-white/40'}`}>
            TV
          </button>
        </div>

        <div className='w-full max-w-[1200px] grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-sm:grid-cols-2 max-xs:gap-3'>
          {filteredResults.filter((item) => item.poster_path && item.poster_path.trim() !== "").map((item) => (
            <Card key={item.id} data={item} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}